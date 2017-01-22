(function () {
'use strict';

/*

Instance properties:

$n = DOM node
$s - spec (see below)
$x - Pool linked list next pointer

Spec properties:

c - create (or render)
u - update (or update)
r - keyed map of unmounted instanced that can be recycled

*/

var isDynamicEmpty = function isDynamicEmpty(v) {
  return v == null || v === true || v === false;
};
var EMPTY_PROPS = {};
var DEADPOOL = {
  push: function push() {},
  pop: function pop() {}
};

// Creates an empty object with no built in properties (ie. `constructor`).
function Hash() {}
Hash.prototype = Object.create(null);

// TODO: Benchmark whether this is slower than Function/Prototype
function Pool() {
  this.map = new Hash();
}

Pool.prototype.push = function (instance) {
  var key = instance.key;
  var map = this.map;

  instance.$x = map[key];
  map[key] = instance;
};

Pool.prototype.pop = function (key) {
  var head = this.map[key];
  if (!head) return;
  this.map[key] = head.$x;
  return head;
};

var recycle = function recycle(instance) {
  instance.$s.r.push(instance);
};
var createTextNode = function createTextNode(value) {
  return document.createTextNode(value);
};

var replaceNode = function replaceNode(oldNode, newNode) {
  var parentNode = oldNode.parentNode;
  if (parentNode) parentNode.replaceChild(newNode, oldNode);
};

function unmountInstance(inst, parentNode) {
  recycle(inst);
  parentNode.removeChild(inst.$n);
}

function removeArrayNodes(array, parentNode, i) {
  while (i < array.length) {
    unmountInstance(array[i++], parentNode);
  }
}

function removeArrayNodesOnlyChild(array, parentNode) {
  var i = 0;

  while (i < array.length) {
    recycle(array[i++]);
  }
  parentNode.textContent = '';
}

function internalRerenderInstance(prevInst, inst) {
  return prevInst.$s === inst.$s && (inst.$s.u(inst, prevInst), true);
}

function renderArrayToParentBefore(parentNode, array, i, markerNode) {
  if (markerNode === null) renderArrayToParent(parentNode, array, i);else renderArrayToParentBeforeNode(parentNode, array, i, markerNode);
}

function renderArrayToParentBeforeNode(parentNode, array, i, beforeNode) {
  while (i < array.length) {
    parentNode.insertBefore((array[i] = internalRender(array[i])).$n, beforeNode);
    ++i;
  }
}

function renderArrayToParent(parentNode, array, i) {
  while (i < array.length) {
    parentNode.appendChild((array[i] = internalRender(array[i])).$n);
    ++i;
  }
}

function rerenderDynamic(isOnlyChild, value, contextNode) {
  var frag = document.createDocumentFragment();
  var node = createDynamic(isOnlyChild, frag, value);
  replaceNode(contextNode, frag);
  return node;
}

function rerenderArrayReconcileWithMinLayout(parentNode, array, oldArray, markerNode) {
  var i = 0;
  for (; i < array.length && i < oldArray.length; i++) {
    array[i] = internalRerender(oldArray[i], array[i]);
  }

  if (i < array.length) {
    renderArrayToParentBefore(parentNode, array, i, markerNode);
  } else {
    removeArrayNodes(oldArray, parentNode, i);
  }
}

function rerenderArrayOnlyChild(parentNode, array, oldArray) {
  if (!oldArray.length) {
    renderArrayToParent(parentNode, array, 0);
  } else if (!array.length) {
    removeArrayNodesOnlyChild(oldArray, parentNode);
  } else {
    rerenderArrayReconcileWithMinLayout(parentNode, array, oldArray, null);
  }
}

function rerenderArray(array, parentOrMarkerNode, isOnlyChild, oldArray) {
  if (array instanceof Array) {
    return isOnlyChild ? rerenderArrayOnlyChild(parentOrMarkerNode, array, oldArray) : rerenderArrayReconcileWithMinLayout(parentOrMarkerNode.parentNode, array, oldArray, parentOrMarkerNode), parentOrMarkerNode;
  }

  if (isOnlyChild) {
    removeArrayNodesOnlyChild(oldArray, parentOrMarkerNode);
    return createDynamic(true, parentOrMarkerNode, array);
  }

  removeArrayNodes(oldArray, parentOrMarkerNode.parentNode, 0);
}

function rerenderText(value, contextNode, isOnlyChild) {
  if (!(value instanceof Object)) {

    contextNode.nodeValue = isDynamicEmpty(value) ? '' : value;
    return contextNode;
  }
}

function rerenderInstance(value, node, isOnlyChild, prevValue) {
  var prevRenderedInstance = void 0;
  if (value && internalRerenderInstance(prevRenderedInstance = prevValue.$r || prevValue, value)) {
    // TODO: What is $r? Is this trying to track the original rendered instnace?
    value.$r = prevRenderedInstance;
    return node;
  }
}

function StatefulComponent(render, props, instance, actions) {
  this._boundActions = new Hash();
  this._parentInst = instance;
  this.actions = actions;
  this.props = props;
  this.render = render;
  this.bindSend = this.bindSend.bind(this);
  this.state = actions.onInit(this);
  this.$n = internalRenderNoRecycle(this._instance = render(this));
}

StatefulComponent.prototype.updateProps = function (newProps) {
  var props = this.props;

  this.props = newProps;

  if (this.actions.onProps) this.send('onProps', props);else this.rerender();

  return this;
};

StatefulComponent.prototype.bindSend = function (action) {
  return this._boundActions[action] || (this._boundActions[action] = this.send.bind(this, action));
};

StatefulComponent.prototype.send = function (actionName, context) {
  var newState = void 0;
  var actionFn = this.actions[actionName];
  // TODO: process.ENV === 'development', console.error(`Action not found #{action}`);
  if (!actionFn || (newState = actionFn(this, context)) == this.state) return;

  this.state = newState;
  this.rerender();
};

StatefulComponent.prototype.rerender = function () {
  var instance = internalRerender(this._instance, this.render(this));
  this._instance = instance;
  instance.$n.xvdom = this._parentInst;
};

function createStatefulComponent(component, props, instance, actions) {
  return new StatefulComponent(component, props, instance, actions);
}

function createStatelessComponent(component, props) {
  var instance = component(props);
  internalRenderNoRecycle(instance);
  return instance;
}

function createComponent(component, actions, props, parentInstance) {
  var result = (actions ? createStatefulComponent : createStatelessComponent)(component, props || EMPTY_PROPS, parentInstance, actions);

  return result;
}

function updateComponent(component, actions, props, componentInstance) {
  var result = actions ? componentInstance.updateProps(props) : internalRerender(componentInstance, component(props));

  return result;
}

function internalRenderNoRecycle(instance) {
  var node = instance.$s.c(instance);
  instance.$n = node;
  node.xvdom = instance;
  return node;
}

function internalRender(instance) {
  var spec = instance.$s;
  var recycledInstance = spec.r.pop(instance.key);
  if (recycledInstance) {
    spec.u(instance, recycledInstance);
    return recycledInstance;
  }

  internalRenderNoRecycle(instance);
  return instance;
}

function createDynamic(isOnlyChild, parentNode, value) {
  return value instanceof Array ? (renderArrayToParent(parentNode, value, 0), isOnlyChild ? parentNode : parentNode.appendChild(createTextNode(''))) : parentNode.appendChild(value instanceof Object ? internalRenderNoRecycle(value) : createTextNode(isDynamicEmpty(value) ? '' : value));
}

function updateDynamic(isOnlyChild, oldValue, value, contextNode) {
  return (oldValue instanceof Object ? oldValue instanceof Array ? rerenderArray(value, contextNode, isOnlyChild, oldValue) : rerenderInstance(value, contextNode, isOnlyChild, oldValue) : rerenderText(value, contextNode, isOnlyChild)) || rerenderDynamic(isOnlyChild, value, contextNode);
}

function internalRerender(prevInstance, instance) {
  if (internalRerenderInstance(prevInstance, instance)) return prevInstance;

  replaceNode(prevInstance.$n, (instance = internalRender(instance)).$n);
  recycle(prevInstance);
  return instance;
}

var render = function render(instance) {
  return internalRender(instance).$n;
};
var rerender = function rerender(node, instance) {
  return internalRerender(node.xvdom, instance).$n;
};
var unmount = function unmount(node) {
  unmountInstance(node.xvdom, node.parentNode);
};

var xvdom = {
  createComponent: createComponent,
  createDynamic: createDynamic,
  el: function el(tag) {
    return document.createElement(tag);
  },
  render: render,
  rerender: rerender,
  unmount: unmount,
  updateComponent: updateComponent,
  updateDynamic: updateDynamic,
  Pool: Pool,
  DEADPOOL: DEADPOOL
};

// Internal API

var _xvdomEl$1 = xvdom.el;
var _xvdomSpec$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('i');

    inst.b = _n;
    _n.className = inst.a;
    _n.onClickArg = inst.c;
    _n.onClickFn = inst.d;
    _n.onclick = inst.e;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.onClickArg = v;
      pInst.c = v;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.b.onClickFn = v;
      pInst.d = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.b.onclick = v;
      pInst.e = v;
    }
  },
  r: xvdom.DEADPOOL
};
var handleClick = function handleClick(_ref) {
  var t = _ref.currentTarget;
  t.onClickFn(t.onClickArg);
};

var Icon = (function (_ref2) {
  var className = _ref2.className,
      name = _ref2.name,
      onClick = _ref2.onClick,
      onClickArg = _ref2.onClickArg,
      _ref2$size = _ref2.size,
      size = _ref2$size === undefined ? 'med' : _ref2$size;
  return {
    $s: _xvdomSpec$1,
    a: 'Icon Icon--' + size + ' octicon octicon-' + name + ' ' + className + ' t-center',
    c: onClickArg,
    d: onClick,
    e: onClick && handleClick
  };
});

var _xvdomCreateDynamic$1 = xvdom.createDynamic;
var _xvdomEl$2 = xvdom.el;
var _xvdomUpdateDynamic$1 = xvdom.updateDynamic;
var _xvdomSpec2$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$2('div');

    _n.className = 'Tabs layout horizontal end center-justified c-white l-height10 t-font-size-14 t-uppercase t-normal';
    inst.b = _xvdomCreateDynamic$1(true, _n, inst.a);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$1(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$2 = {
  c: function c(inst) {
    var _n = _xvdomEl$2('a');

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    inst.e = _xvdomCreateDynamic$1(true, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$1(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
function renderTab(tabId) {
  var tabs = this.tabs,
      selected = this.selected,
      hrefPrefix = this.hrefPrefix;
  var _tabs$tabId = tabs[tabId],
      href = _tabs$tabId.href,
      title = _tabs$tabId.title;

  return {
    $s: _xvdomSpec$2,
    a: 'Tabs-tab u-cursor-pointer l-padding-h4 l-padding-b2 ' + (selected === tabId ? 'is-selected' : ''),
    c: '' + hrefPrefix + (href || tabId),
    d: title || tabId,
    key: tabId
  };
}

var Tabs = (function (props) {
  return {
    $s: _xvdomSpec2$1,
    a: Object.keys(props.tabs).map(renderTab, props)
  };
});

var loadJSON = function loadJSON(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    var accessToken = localStorage.getItem('ticker:token:github');
    xhr.open('GET', url);
    if (accessToken) xhr.setRequestHeader('Authorization', 'token ' + accessToken);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onerror = reject;
    xhr.onload = function () {
      var response = xhr.response;
      if (response) {
        resolve(typeof response === 'string' ? JSON.parse(response) : response);
      } else {
        reject(new Error('loadJSON: empty response'));
      }
    };
  });
};

loadJSON.setAccessToken = function (accessToken) {
  localStorage.setItem('ticker:token:github', accessToken);
};

/*

Cross-session, Key-Value, LRU expunging storage.

*/

var REGISTRY_KEY = 'ticker:storage';

// Map of storage key to last used timestamp.
var registry = void 0;
try {
  registry = JSON.parse(localStorage.getItem(REGISTRY_KEY));
} catch (e) {} // eslint-disable-line no-empty

if (!registry) localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry = []));

var removeLRUItem = function removeLRUItem() {
  var lruKey = registry.pop();
  if (lruKey) {
    localStorage.removeItem(lruKey);
    updateRegistryKey(lruKey, false); // eslint-disable-line no-use-before-define
  }
};

var safeSetItem = function safeSetItem(key, value) {
  var remainingTries = registry.length;
  while (remainingTries--) {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (e) {
      removeLRUItem();
    }
  }
  
};

var updateRegistryKey = function updateRegistryKey(key, isAdd) {
  var keyIndex = registry.indexOf(key);
  if (keyIndex >= 0) registry.splice(keyIndex, 1);
  if (isAdd) registry.unshift(key);

  safeSetItem(REGISTRY_KEY, JSON.stringify(registry));
};

var updateLRUItem = function updateLRUItem(key) {
  updateRegistryKey(key, true);
};

var storage = {
  getItem: function getItem(key) {
    var value = localStorage.getItem(key);
    if (value) updateLRUItem(key);
    return value;
  },
  setItem: function setItem(key, value) {
    safeSetItem(key, value);
    updateLRUItem(key);
    return value;
  },
  getItemObj: function getItemObj(key) {
    var valueString = this.getItem(key);

    var value = valueString && JSON.parse(valueString);

    return value;
  },
  setItemObj: function setItemObj(key, value) {
    this.setItem(key, JSON.stringify(value));

    return value;
  }
};

var identity = function identity(o) {
  return o;
};
var fromCache = function fromCache(cacheKey) {
  return storage.getItemObj(cacheKey);
};
var load = function load(_ref) {
  var url = _ref.url,
      cache = _ref.cache,
      _ref$transform = _ref.transform,
      transform = _ref$transform === undefined ? identity : _ref$transform;
  return loadJSON(url).then(transform).then(!cache ? identity : function (obj) {
    return storage.setItemObj(cache, obj);
  });
};

var model = (function (_ref2) {
  var g = _ref2.get,
      q = _ref2.query;
  return {
    localGet: function localGet(options) {
      return fromCache(g(options).cache);
    },
    get: function get(options) {
      return load(g(options));
    },
    localQuery: function localQuery(options) {
      return fromCache(q(options).cache);
    },
    query: function query(options) {
      return load(q(options));
    }
  };
});

var DB = model({
  get: function get() {
    return {
      transform: function transform(db) {
        db.outfitIds = Object.keys(db.outfits).map(function (id) {
          return +id;
        });
        return db;
      },
      // TODO: Figure out IndexDB as it may allow for ~50MB amount data
      // cache: `okDB`,
      url: '../static/db.json'
    };
  }
});

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();













var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var LAST_LOGIN_ID_STORAGE_KEY = 'ok:lastLoggedInUserId';
var fb = function fb(id) {
  return firebase.database().ref('users/' + id);
};
var store = function store(user) {
  return storage.setItemObj('ok:' + user.id, user);
};

var CATEGORIES = ['yup', 'nope', 'maybe'];

var User = {
  current: function current() {
    var lastLoginId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
    if (!lastLoginId) return;
    return this.localGet(lastLoginId);
  },

  setCurrent: function setCurrent(id) {
    return storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id);
  },
  unsetCurrent: function unsetCurrent() {
    var user = this.current();
    if (!user) return;
    storage.setItemObj('ok:' + user.id, '');
    storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, '');
  },

  localGet: function localGet(id) {
    return storage.getItemObj('ok:' + id);
  },
  // TODO: Move App.jsx creating/initializing a new user into here create: => {}
  save: function save(user) {
    return new Promise(function (resolve, reject) {
      fb(user.id).set(user, function (err) {
        if (err) return reject(err);
        resolve(store(_extends({}, user)));
      });
    });
  },
  get: function get(id) {
    return new Promise(function (resolve, reject) {
      fb(id).once('value', function (data) {
        var val = data.val();
        if (!val) return reject("Couldn't find User");
        resolve(store(val));
      });
    });
  }
};

var _xvdomCreateComponent$1 = xvdom.createComponent;
var _xvdomCreateDynamic$2 = xvdom.createDynamic;
var _xvdomEl$3 = xvdom.el;
var _xvdomUpdateComponent$1 = xvdom.updateComponent;
var _xvdomUpdateDynamic$2 = xvdom.updateDynamic;
var _xvdomSpec$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$3('div'),
        _n2,
        _n3,
        _n4;

    inst.b = _n;
    _n.className = inst.a;
    _n2 = _xvdomEl$3('div');
    inst.d = _n2;
    _n2.className = inst.c;
    _n3 = _xvdomEl$3('div');
    _n3.className = 'layout horizontal center-center l-height14';
    inst.f = _xvdomCreateDynamic$2(false, _n3, inst.e);
    _n4 = _xvdomEl$3('div');
    _n4.className = 'l-padding-r0 t-truncate t-font-size-20 flex';
    inst.h = _n4;
    _n4.textContent = inst.g;

    _n3.appendChild(_n4);

    _n4 = (inst.j = _xvdomCreateComponent$1(Icon, Icon.state, {
      className: 't-bold c-white l-padding-h4',
      onClick: inst.i,
      size: 'small'
    }, inst)).$n;

    _n3.appendChild(_n4);

    inst.l = _xvdomCreateDynamic$2(false, _n3, inst.k);

    _n2.appendChild(_n3);

    inst.n = _xvdomCreateDynamic$2(false, _n2, inst.m);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.className = v;
      pInst.c = v;
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$2(false, pInst.e, pInst.e = inst.e, pInst.f);
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.h.textContent = v;
      pInst.g = v;
    }

    if (inst.i !== pInst.i) {
      pInst.j = _xvdomUpdateComponent$1(Icon, Icon.state, {
        className: 't-bold c-white l-padding-h4',
        onClick: pInst.i = inst.i,
        size: 'small'
      }, pInst.j);
    }

    if (inst.k !== pInst.k) {
      pInst.l = _xvdomUpdateDynamic$2(false, pInst.k, pInst.k = inst.k, pInst.l);
    }

    if (inst.m !== pInst.m) {
      pInst.n = _xvdomUpdateDynamic$2(false, pInst.m, pInst.m = inst.m, pInst.n);
    }
  },
  r: xvdom.DEADPOOL
};
// import App   from './App.jsx';
var showSearch = function showSearch() {/*App.showSearch()*/};

var AppToolbar = function AppToolbar(_ref) {
  var _ref$props = _ref.props,
      title = _ref$props.title,
      secondary = _ref$props.secondary,
      left = _ref$props.left,
      right = _ref$props.right,
      scrollClass = _ref.state.scrollClass;
  return {
    $s: _xvdomSpec$3,
    a: 'AppToolbar ' + (secondary ? 'AppToolbar--withSecondary' : ''),
    c: 'AppToolbar-bar fixed fixed--top c-white bg-purple ' + scrollClass,
    e: left,
    g: title,
    i: showSearch,
    k: right,
    m: secondary
  };
};

var getScrollState = function getScrollState(prevScrollTop) {
  var scrollTop = document.body ? document.body.scrollTop : 0;
  var isScrollingDown = scrollTop > 56 && scrollTop - prevScrollTop > 0;
  return {
    scrollTop: scrollTop,
    scrollClass: isScrollingDown ? ' is-scrolling-down' : ''
  };
};

AppToolbar.state = {
  onInit: function onInit(_ref2) {
    var bindSend = _ref2.bindSend;
    return requestAnimationFrame(function () {
      return document.body.onscroll = bindSend('onScroll');
    }), getScrollState(0);
  },

  onScroll: function onScroll(_ref3) {
    var scrollTop = _ref3.state.scrollTop;
    return getScrollState(scrollTop);
  }
};

var _xvdomCreateDynamic$4 = xvdom.createDynamic;
var _xvdomEl$5 = xvdom.el;
var _xvdomUpdateDynamic$4 = xvdom.updateDynamic;
var _xvdomSpec2$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$5('div');

    inst.b = _n;
    _n.className = inst.a;
    _n.hidden = inst.c;
    inst.e = _xvdomCreateDynamic$4(true, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.hidden = v;
      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$4(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$5 = {
  c: function c(inst) {
    var _n = _xvdomEl$5('a');

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    inst.e = _xvdomCreateDynamic$4(true, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$4(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var identity$1 = function identity$1(o) {
  return o;
};

function renderItem(el) {
  var item = this.item,
      context = this.context,
      itemClass = this.itemClass;

  var _item = item(el, context),
      href = _item.href,
      key = _item.key,
      text = _item.text;

  return {
    $s: _xvdomSpec$5,
    a: 'List-item layout horizontal center t-normal ' + (itemClass || ''),
    c: href,
    d: text,
    key: key
  };
}

var List = (function (props) {
  var className = props.className,
      context = props.context,
      list = props.list,
      _props$transform = props.transform,
      transform = _props$transform === undefined ? identity$1 : _props$transform;

  var items = transform ? transform(list, context) : list || [];
  return {
    $s: _xvdomSpec2$3,
    a: className,
    c: !items.length,
    d: items.map(renderItem, props)
  };
});

var titlecase = (function (s) {
  return String.fromCharCode(s.charCodeAt(0) - 32) + s.slice(1);
});

var _xvdomCreateComponent$2 = xvdom.createComponent;
var _xvdomCreateDynamic$3 = xvdom.createDynamic;
var _xvdomEl$4 = xvdom.el;
var _xvdomUpdateComponent$2 = xvdom.updateComponent;
var _xvdomUpdateDynamic$3 = xvdom.updateDynamic;
var _xvdomSpec6$1 = {
  c: function c(inst) {
    var _n = (inst.e = _xvdomCreateComponent$2(List, List.state, {
      className: 'Card',
      transform: inst.a,
      item: inst.b,
      itemClass: 'List-item--noPadding',
      context: inst.c,
      list: inst.d
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$2(List, List.state, {
        className: 'Card',
        transform: pInst.a = inst.a,
        item: pInst.b = inst.b,
        itemClass: 'List-item--noPadding',
        context: pInst.c = inst.c,
        list: pInst.d = inst.d
      }, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5$1 = {
  c: function c(inst) {
    var _n = (inst.f = _xvdomCreateComponent$2(OutfitRow, OutfitRow.state, {
      db: inst.a,
      outfitId: inst.b,
      selectedOutfitId: inst.c,
      onSelect: inst.d,
      onSetCategory: inst.e
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.d !== pInst.d || inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateComponent$2(OutfitRow, OutfitRow.state, {
        db: pInst.a = inst.a,
        outfitId: pInst.b = inst.b,
        selectedOutfitId: pInst.c = inst.c,
        onSelect: pInst.d = inst.d,
        onSetCategory: pInst.e = inst.e
      }, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$4('div'),
        _n2;

    inst.b = _n;
    _n.className = inst.a;
    _n2 = _xvdomEl$4('div');
    _n2.className = 'OutfitRow-items layout horizontal center';
    inst.d = _xvdomCreateDynamic$3(true, _n2, inst.c);

    _n.appendChild(_n2);

    inst.f = _xvdomCreateDynamic$3(false, _n, inst.e);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$3(true, pInst.c, pInst.c = inst.c, pInst.d);
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$3(false, pInst.e, pInst.e = inst.e, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$4('div');

    _n.className = 'List';
    inst.b = _xvdomCreateDynamic$3(true, _n, inst.a);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$3(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$2 = {
  c: function c(inst) {
    var _n = _xvdomEl$4('a');

    _n.className = 'List-item List-item--selection';
    inst.b = _n;
    _n.onclick = inst.a;
    _n.innerText = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.onclick = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.innerText = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$4 = {
  c: function c(inst) {
    var _n = _xvdomEl$4('span');

    inst.b = _n;
    _n.className = inst.a;
    _n.itemId = inst.c;
    _n.itemType = inst.d;
    _n.onclick = inst.e;
    _n.style = inst.f;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.itemId = v;
      pInst.c = v;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.b.itemType = v;
      pInst.d = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.b.onclick = v;
      pInst.e = v;
    }

    v = inst.f;

    if (v !== pInst.f) {
      pInst.b.style = v;
      pInst.f = v;
    }
  },
  r: xvdom.DEADPOOL
};
var PAGE_SIZE = 25;
var ITEM_TYPES = ['bottom', 'shirt', 'sweater', 'businessAttire'];
var EMPTY_SELECTED_ITEM_IDS = ITEM_TYPES.reduce(function (obj, type) {
  return obj[type] = 0, obj;
}, {});

var OutfitRow = function OutfitRow(_ref) {
  var _ref$props = _ref.props,
      db = _ref$props.db,
      outfitId = _ref$props.outfitId,
      selectedOutfitId = _ref$props.selectedOutfitId,
      onSelect = _ref$props.onSelect,
      onSetCategory = _ref$props.onSetCategory,
      selectedItems = _ref.state.selectedItems,
      bindSend = _ref.bindSend;

  var outfit = db.outfits[outfitId];
  var isSelected = outfitId === selectedOutfitId;
  return {
    $s: _xvdomSpec4$1,
    a: 'OutfitRow ' + (isSelected ? 'is-selected' : ''),
    c: ITEM_TYPES.map(function (type) {
      var itemId = outfit[type];
      return {
        $s: _xvdomSpec$4,
        a: 'OutfitRow-item flex ' + (selectedItems[type] === itemId ? 'is-selected' : ''),
        c: itemId,
        d: type,
        e: bindSend('handleSelectItem'),
        f: 'background-image: url(' + db.items[itemId].closet_image_url + ')'
      };
    }),
    e: isSelected && {
      $s: _xvdomSpec3$1,
      a: CATEGORIES.map(function (cat) {
        return {
          $s: _xvdomSpec2$2,
          a: function a() {
            return onSetCategory(cat);
          },
          c: titlecase(cat)
        };
      })
    }
  };
};

OutfitRow.state = {
  onInit: function onInit$1(_ref2) {
    var props = _ref2.props;
    return {
      selectedItems: EMPTY_SELECTED_ITEM_IDS
    };
  },

  onProps: function onProps(_ref3) {
    var _ref3$props = _ref3.props,
        selectedOutfitId = _ref3$props.selectedOutfitId,
        outfit = _ref3$props.outfit,
        outfitId = _ref3$props.outfitId,
        state = _ref3.state;
    return {
      selectedItems: selectedOutfitId === outfitId ? state.selectedItems : EMPTY_SELECTED_ITEM_IDS
    };
  },

  handleSelectItem: function handleSelectItem(_ref4, _ref5) {
    var props = _ref4.props,
        selectedItems = _ref4.state.selectedItems;
    var currentTarget = _ref5.currentTarget;
    var itemId = currentTarget.itemId,
        itemType = currentTarget.itemType;

    setTimeout(function () {
      return props.onSelect(props.outfitId);
    });
    return {
      selectedItems: _extends({}, selectedItems, defineProperty({}, itemType, selectedItems[itemType] === 0 ? +itemId : 0))
    };
  }
};

var renderOutfitListItem = function renderOutfitListItem(outfitId, _ref6) {
  var db = _ref6.db,
      selectedOutfitId = _ref6.selectedOutfitId,
      onSelect = _ref6.onSelect,
      onSetCategory = _ref6.onSetCategory;
  return {
    text: {
      $s: _xvdomSpec5$1,
      a: db,
      b: outfitId,
      c: selectedOutfitId,
      d: onSelect,
      e: onSetCategory
    }
  };
};

function isUncategorized(outfitId) {
  // this === user
  var cat;
  for (var i = 0; i < CATEGORIES.length; ++i) {
    cat = CATEGORIES[i];
    if (this[cat] && this[cat][outfitId]) return false;
  }
  return true;
}

var firstTen = function firstTen(outfits, _ref7) {
  var db = _ref7.db,
      category = _ref7.category,
      user = _ref7.user;

  if (category === 'uncategorized') {
    return db.outfitIds.filter(isUncategorized, user).slice(0, PAGE_SIZE);
  }
  return outfits ? Object.keys(outfits) : [];
};

var OutfitList = function OutfitList(_ref8) {
  var _ref8$props = _ref8.props,
      user = _ref8$props.user,
      category = _ref8$props.category,
      db = _ref8$props.db,
      selectedOutfitId = _ref8.state.selectedOutfitId,
      bindSend = _ref8.bindSend;
  return {
    $s: _xvdomSpec6$1,
    a: firstTen,
    b: renderOutfitListItem,
    c: {
      category: category,
      db: db,
      user: user,
      selectedOutfitId: selectedOutfitId,
      onSelect: bindSend('handleSelectOutfit'),
      onSetCategory: bindSend('handleSetCategory')
    },
    d: user[category]
  };
};

var onInit$1 = function onInit$1(_ref9) {
  var props = _ref9.props,
      state = _ref9.state;
  return { selectedOutfitId: state && state.selectedOutfitId || 0 };
};

OutfitList.state = {
  onInit: onInit$1,
  onProps: onInit$1,
  handleSelectOutfit: function handleSelectOutfit(_$$1, selectedOutfitId) {
    return { selectedOutfitId: selectedOutfitId };
  },
  handleSetCategory: function handleSetCategory(_ref10, cat) {
    var user = _ref10.props.user,
        selectedOutfitId = _ref10.state.selectedOutfitId;

    user[cat] = user[cat] || {};
    if (!user[cat][selectedOutfitId]) {
      [].concat(toConsumableArray(CATEGORIES), ['uncategorized']).forEach(function (otherCat) {
        if (otherCat === cat) user[otherCat][selectedOutfitId] = 1;else if (user[otherCat]) {
          var catOutfits = user[otherCat];
          delete catOutfits[selectedOutfitId];
        }
      });
      User.save(user);
    }
    return 0;
  }
};

var sw = navigator.serviceWorker;
if (sw) {
  sw.register('../serviceWorker.js');
}

var _xvdomCreateComponent = xvdom.createComponent;
var _xvdomCreateDynamic = xvdom.createDynamic;
var _xvdomEl = xvdom.el;
var _xvdomUpdateComponent = xvdom.updateComponent;
var _xvdomUpdateDynamic = xvdom.updateDynamic;
var _xvdomSpec9 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent(App, App.state, {
      user: inst.a,
      db: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent(App, App.state, {
        user: pInst.a = inst.a,
        db: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec8 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent(Tabs, Tabs.state, {
      hrefPrefix: '#',
      selected: inst.a,
      tabs: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent(Tabs, Tabs.state, {
        hrefPrefix: '#',
        selected: pInst.a = inst.a,
        tabs: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec7 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'three-bars',
      size: 'small'
    }, inst).$n;

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
var _xvdomSpec6 = {
  c: function c(inst) {
    var _n = _xvdomEl('body'),
        _n2;

    _n2 = (inst.c = _xvdomCreateComponent(AppToolbar, AppToolbar.state, {
      left: inst.a,
      secondary: inst.b,
      title: 'OK'
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = _xvdomEl('button');
    inst.e = _n2;
    _n2.onclick = inst.d;
    inst.g = _xvdomCreateDynamic(true, _n2, inst.f);

    _n.appendChild(_n2);

    inst.i = _xvdomCreateDynamic(false, _n, inst.h);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent(AppToolbar, AppToolbar.state, {
        left: pInst.a = inst.a,
        secondary: pInst.b = inst.b,
        title: 'OK'
      }, pInst.c);
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.e.onclick = v;
      pInst.d = v;
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateDynamic(true, pInst.f, pInst.f = inst.f, pInst.g);
    }

    if (inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateDynamic(false, pInst.h, pInst.h = inst.h, pInst.i);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent(OutfitList, OutfitList.state, {
      category: inst.a,
      db: inst.b,
      user: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent(OutfitList, OutfitList.state, {
        category: pInst.a = inst.a,
        db: pInst.b = inst.b,
        user: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4 = {
  c: function c() {
    var _n = _xvdomEl('div');

    _n.appendChild(document.createTextNode(('Hello') || ''));

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
var _xvdomSpec3 = {
  c: function c() {
    var _n = _xvdomEl('div');

    _n.appendChild(document.createTextNode(('Hello') || ''));

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
var _xvdomSpec2 = {
  c: function c() {
    var _n = _xvdomEl('div');

    _n.appendChild(document.createTextNode(('Hello') || ''));

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
var _xvdomSpec = {
  c: function c() {
    var _n = _xvdomEl('div');

    _n.appendChild(document.createTextNode(('Hello') || ''));

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    User.unsetCurrent();
    return firebase.auth().signOut();
  }

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/plus.login');
  firebase.auth().signInWithPopup(provider).catch(function (error) {
    return console.error(error);
  });
}

var TABS = {
  uncategorized: {
    title: 'Uncategorized',
    view: function view(id) {
      return {
        $s: _xvdomSpec
      };
    }
  },
  yup: {
    title: 'Yup',
    view: function view(id) {
      return {
        $s: _xvdomSpec2
      };
    }
  },
  nope: {
    title: 'Nope',
    view: function view(id) {
      return {
        $s: _xvdomSpec3
      };
    }
  },
  maybe: {
    title: 'Maybe',
    view: function view(id) {
      return {
        $s: _xvdomSpec4
      };
    }
  }
};

var App = function App(_ref) {
  var _ref$props = _ref.props,
      user = _ref$props.user,
      db = _ref$props.db,
      category = _ref.state.category;
  return {
    $s: _xvdomSpec6,
    a: {
      $s: _xvdomSpec7
    },
    b: {
      $s: _xvdomSpec8,
      a: category,
      b: TABS
    },
    d: toggleSignIn,
    f: user ? 'Sign out' : 'Sign in',
    h: user && db && {
      $s: _xvdomSpec5,
      a: category,
      b: db,
      c: user
    }
  };
};

var getCategoryFromHash = function getCategoryFromHash() {
  return window.location.hash.slice(1) || 'uncategorized';
};

var stateFromHash = function stateFromHash(_ref2) {
  var state = _ref2.state;
  return {
    category: getCategoryFromHash() || state && state.category
  };
};

App.state = {
  onInit: function onInit(_ref3) {
    var bindSend = _ref3.bindSend;

    window.onhashchange = bindSend('handleHashChange');
    return stateFromHash({});
  },
  onProps: stateFromHash,
  handleHashChange: stateFromHash
};

var renderApp = function renderApp(user, db) {
  return {
    $s: _xvdomSpec9,
    a: user,
    b: db
  };
};

firebase.initializeApp({
  apiKey: "AIzaSyBOWk2fU2p4Br1agfu25gY5NGYXy0ZDyS0",
  authDomain: "outfit-knockout-ef20f.firebaseapp.com",
  databaseURL: "https://outfit-knockout-ef20f.firebaseio.com",
  storageBucket: "outfit-knockout-ef20f.appspot.com"
});

DB.get().then(function (db) {
  document.body = xvdom.render(renderApp(User.current(), db));

  firebase.auth().onAuthStateChanged(function (authUser) {
    if (!authUser) return xvdom.rerender(document.body, renderApp(null, null));

    // Get or create user information
    User.get(authUser.uid).catch(function () {
      return User.save({
        // Couldn't find existing user w/authId, so create a new User
        id: authUser.uid,
        displayName: authUser.displayName,
        excludedCombos: {},
        yup: {},
        nope: {},
        maybe: {}
      });
    }).then(function (user) {
      User.setCurrent(user.id);
      xvdom.rerender(document.body, renderApp(user, db));
    });
  });
});

}());
