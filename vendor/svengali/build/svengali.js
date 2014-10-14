System.register([], function($__export) {
  "use strict";
  var StateChart,
      EMPTY_OBJ,
      NOOP,
      nextStateUID,
      State;
  function attrValue(val) {
    if (this instanceof attrValue)
      this.val = val;
    else
      return new attrValue(val);
  }
  $__export("attrValue", attrValue);
  return {
    setters: [],
    execute: function() {
      StateChart = $__export("StateChart", (function() {
        var StateChart = function StateChart(rootStateOptions) {
          this.attrs = {};
          this.rootState = new State(null, this, rootStateOptions);
        };
        return ($traceurRuntime.createClass)(StateChart, {goto: function() {
            var path = arguments[0] !== (void 0) ? arguments[0] : '.';
            var params = arguments[1] !== (void 0) ? arguments[1] : {};
            this.rootState.scState.goto(path, {context: params});
          }}, {});
      }()));
      EMPTY_OBJ = {};
      NOOP = (function() {
        return EMPTY_OBJ;
      });
      nextStateUID = 1;
      State = $__export("State", (function() {
        var State = function State(parent, stateChart, $__2) {
          var $__3 = $__2,
              concurrent = $__3.concurrent,
              history = $__3.history,
              params = $__3.params,
              attrs = $__3.attrs,
              enter = $__3.enter,
              exit = $__3.exit,
              events = $__3.events,
              states = $__3.states,
              defaultState = $__3.default;
          var name = arguments[3] !== (void 0) ? arguments[3] : nextStateUID++;
          var $__0 = this;
          this.params = params;
          this.stateChart = stateChart;
          this.attrs = attrs || EMPTY_OBJ;
          this.enter = enter || NOOP;
          this.exit = exit || NOOP;
          var scState = this.scState = statechart.State(name, {
            name: name,
            concurrent: !!concurrent,
            history: !!history
          });
          if (params)
            scState.canEnter = (function(states, params) {
              return $__0._canEnter_checkParams(params);
            });
          scState.enter((function(params) {
            return $__0._doEnter(params);
          }));
          scState.exit((function() {
            return $__0._doExit();
          }));
          if (events)
            Object.keys(events).forEach((function(eventName) {
              return scState.event(eventName, events[eventName]);
            }));
          if (states)
            (defaultState && states[defaultState] ? [defaultState] : []).concat(Object.keys(states)).forEach((function(stateName) {
              return scState.addSubstate(new State($__0, stateChart, states[stateName], stateName).scState);
            }));
        };
        return ($traceurRuntime.createClass)(State, {
          _setAttrValue: function(name, val) {
            this.stateChart.attrs[name] = val;
          },
          _canEnter_checkParams: function(params) {
            if (this.params)
              return params ? this.params.every((function(p) {
                return p in params;
              })) : false;
          },
          _doEnter_setAttrs: function(context) {
            var $__0 = this;
            Object.keys(this.attrs).forEach((function(a) {
              var val = $__0.attrs[a];
              val = (typeof val === 'function') ? val(context) : val;
              if (!(val instanceof Promise))
                $__0._setAttrValue(a, (val instanceof attrValue ? val.val : val));
              else
                val.then((function(value) {
                  if ($__0.scState.__isCurrent__)
                    $__0._setAttrValue(a, value);
                }));
            }));
          },
          _doEnter: function(context) {
            this._doEnter_setAttrs(context);
            this.enter();
          },
          _doExit: function() {
            var $__0 = this;
            this.exit();
            Object.keys(this.attrs).forEach((function(a) {
              return delete $__0.stateChart.attrs[a];
            }));
          }
        }, {});
      }()));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xIiwic3ZlbmdhbGkuanMiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvNSIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8wIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzQiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxLQUFLLFNBQVMsQUFBQyxJQUFvQixVQUFTLFNBQVE7Ozs7Ozs7QUNpTDdDLFNBQVMsVUFBUSxDQUFFLEdBQUUsQ0FBRTtBQUM1QixPQUFHLElBQUcsV0FBYSxVQUFRO0FBQ3pCLFNBQUcsSUFBSSxFQUFJLElBQUUsQ0FBQzs7QUFFZCxXQUFPLElBQUksVUFBUSxBQUFDLENBQUMsR0FBRSxDQUFDLENBQUM7QUFBQSxFQUM3QjtBQ3JMUSxBRHFMUixVQ3JMZ0IsQUFBQyx3QkFBcUMsQ0FBQTtBQ0R0RCxPQUFPO0FBQ0QsVUFBTSxJQUFtQjtBQUN6QixVQUFNO2lCQ0ZZLENBQUEsU0FBUSxBQUFDLGdCQ0FqQyxTQUFRLEFBQUM7QUFDQyxBQUFJLFVBQUEsYUo2QlAsU0FBTSxXQUFTLENBb0lSLGdCQUFlLENBQUU7QUFDM0IsYUFBRyxNQUFNLEVBQUksR0FBQyxDQUFDO0FBQ2YsYUFBRyxVQUFVLEVBQUksSUFBSSxNQUFJLEFBQUMsQ0FBQyxJQUFHLENBQUcsS0FBRyxDQUFHLGlCQUFlLENBQUMsQ0FBQztRSW5LVixBSm9LaEQsQ0lwS2lEO0FBQ3pDLGFBQU8sQ0FBQSxDQUFDLGVBQWMsWUFBWSxDQUFDLEFBQUMsY0pxSzVDLElBQUcsQ0FBSCxVQUFLLEFBQWtCLENBQUU7Y0FBcEIsS0FBRyw2Q0FBRSxJQUFFO2NBQUcsT0FBSyw2Q0FBRSxHQUFDO0FBQ3JCLGVBQUcsVUFBVSxRQUFRLEtBQUssQUFBQyxDQUFDLElBQUcsQ0FBRyxFQUFDLE9BQU0s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LENBQUEsQ0FBQztZQUFBLEVBQUMsQ0FBQztVQUNyRTthSWhROEQsQ0FBQztNQUN6RCxBQUFDLEVBQUMsRURKNEQ7SURFdkM7RUFDM0IsQ0FBQTtBSERJLENBQUMsQ0FBQztBQ21RViIsImZpbGUiOiJzdmVuZ2FsaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlN5c3RlbS5yZWdpc3RlcigkX19wbGFjZWhvbGRlcl9fMCwgZnVuY3Rpb24oJF9fZXhwb3J0KSB7XG4gICAgICAgICAgJF9fcGxhY2Vob2xkZXJfXzFcbiAgICAgICAgfSk7IiwiLypcblB1YmxpYzogQW4gZW5jYXBzdWxhdGlvbiBvZiBhIHN0YXRlIGNoYXJ0J3MgYXR0cnMgYW5kIGJlaGF2aW9yXG5cbkV4YW1wbGVzXG5cbiAgdmFyIHMgPSBuZXcgU3RhdGVDaGFydCh7XG4gICAgYXR0cnM6IFsncm9vdF9hdHRyJ10sXG4gICAgZW50ZXIoKXsgdGhpcy5yb290X2F0dHI9J3Jvb3RfYXR0ciB2YWx1ZScgfSxcblxuICAgIGRlZmF1bHRTdGF0ZTogJ29uJyxcbiAgICBzdGF0ZXM6e1xuICAgICAgb2ZmOntcbiAgICAgICAgYXR0cnM6IHtpc09uOiBmYWxzZX1cbiAgICAgIH0sXG4gICAgICBvbjp7XG4gICAgICAgIGF0dHJzOiB7aXNPbjogdHJ1ZX1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHMuZ290bygpO1xuXG4gIHMuYXR0cnM7XG4gIC8vPT4ge3Jvb3RfYXR0cjoncm9vdF9hdHRyIHZhbHVlJywgb25fYXR0cjonb25fYXR0ciB2YWx1ZSd9XG5cbiAgcy5nb3RvKCdvZmYnKTtcblxuICBzLmF0dHJzO1xuICAvLz0+IHtyb290X2F0dHI6J3Jvb3RfYXR0ciB2YWx1ZScsIG9mZl9hdHRyOidvZmZfYXR0ciB2YWx1ZSd9XG4qL1xuZXhwb3J0IGNsYXNzIFN0YXRlQ2hhcnQge1xuXG4gIC8qXG4gIFB1YmxpYzogQ3JlYXRlcyBhIFN0YXRlQ2hhcnQgZnJvbSB0aGUgZGVmaW5pdGlvbiBvZiB0aGUgcm9vdCBzdGF0ZS5cblxuICBvcHRpb25zIC0gYW4gT2JqZWN0IGRlZmluaW5nIHRoZSByb290IHN0YXRlIChkZWZhdWx0OiB7fSlcbiAgICAgICAgICAgIGNvbmN1cnJlbnQ6IC0gYSBCb29sZWFuLCBpZiB0cnVlLCBtYWtlcyBhIGNvbmN1cnJlbnQgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGRlZmF1bHQ6IHRydWUpLlxuXG4gICAgICAgICAgICBoaXN0b3J5OiAgICAtIGEgQm9vbGVhbiwgaWYgdHJ1ZSwgbWFrZXMgYSBoaXN0b3J5IHN0YXRlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAoZGVmYXVsdDogZmFsc2UpLlxuXG4gICAgICAgICAgICBwYXJhbXM6ICAgICAtIGFuIEFycmF5IG9mIHBhcmFtZXRlcnMgcmVxdWlyZWQgdG8gZW50ZXIgdGhpcyBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAob3B0aW9uYWwpLlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEV4YW1wbGVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEFSVElDTEVTPVt7dGl0bGU6J2hlbGxvIHdvcmxkJ31dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IG5ldyBTdGF0ZUNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJ2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZXM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbJ2FydGljbGVJZCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6ICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGU6ICh7YXJ0aWNsZUlkfSk9PkFSVElDTEVTW2FydGljbGVJZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OnsuLi59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB5b3UgZG9uJ3QgcGFzcyBhbGwgcmVxdWlyZWQgcGFyYW1zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmdvdG8oJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5nb3RvKCdzaG93Jywge2FydGljbGVJZDowfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmF0dHJzLmFydGljbGUudGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vPT4gJ2hlbGxvIHdvcmxkJ1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgQXR0ZW1wdGluZyB0byBnbyB0byBhIHN0YXRlIHdpdGhvdXQgcHJvdmlkaW5nIGFsbCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmVjZXNzYXJ5IHBhcmFtcyB3aWxsIHByZXZlbnQgdGhlIHRyYW5zaXRpb24uXG5cbiAgICAgICAgICAgIGF0dHJzOiAgICAgIC0gYW4gT2JqZWN0IG1hcCBvZiBhdHRycyBhbmQgdGhlaXIgdmFsdWVzIHRoYXQgd2lsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiZSByZWFkLW9ubHkgYWNjZXNzYWJsZSBvbiB0aGUgYGF0dHJzYCBhdHRyaWJ1dGUgb24gdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlIGNoYXJ0IChvcHRpb25hbCkuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgRXhhbXBsZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09uICAgICAgIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhYiA6ICdwcm9maWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICMjIyBPbiBlbnRlciBkZXRlcm1pbmVkIGF0dHIgdmFsdWVzXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgU3BlY2lmeWluZyBhbiBhdHRyIGluaXRpYWxpemVyIGZ1bmN0aW9uIGFsbG93cyB0aGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYmUgZGV0ZXJtaW5lZCB1cG9uIGVudGVyaW5nIHRoZSBzdGF0ZS5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICBFeGFtcGxlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRBdDogKCk9PkRhdGUubm93KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICBBdHRyIGluaXRhbGl6ZXIgZnVuY3Rpb25zIHJlY2VpdmVzIHRoZSBgcGFyYW1zYCBvYmplY3QuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgRXhhbXBsZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFsnYXJ0aWNsZUlkJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlOiAoe2FydGljbGVJZH0pPT5BcnRpY2xlLmdldChhcnRpY2xlSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIyMjIFByb21pc2UgYXR0ciB2YWx1ZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIFByb21pc2UgYWxsb3dzIHZhbHVlcyB0byBiZVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVkIGFzeW5jaHJvbm91c2x5LlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEV4YW1wbGVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZTogKCk9Pm5ldyBQcm9taXNlKHJlc29sdmU9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoQXJ0aWNsZShyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIyMjIEF0dHIgdmFsdWVzIHRoYXQgYXJlIGZ1bmN0aW9ucyBvciBQcm9taXNlc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIElmIGF0dHIgdmFsdWUgaXMgYSBmdW5jdGlvbiwgc2ltcGx5IHdyYXAgdGhlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9yIFByb21pc2UgaW4gYW4gYGF0dHJWYWx1ZSgpYC5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICBFeGFtcGxlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEdyZWV0aW5nOiBhdHRyVmFsdWUoKCk9PidIZWxsbyBXb3JsZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrUHJvbWlzZTogKCk9PmF0dHJWYWx1ZShuZXcgUHJvbWlzZSguLi4pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICMjIyBEZXBlbmRhbnQgYXR0ciB2YWx1ZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICBZb3UgY2FuIGFjY2VzcyBvdGhlciBhdHRycyB1c2luZyBgdGhpc2AuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgRXhhbXBsZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiAgICAoKT0+bmV3IFVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6ICgpPT50aGlzLnVzZXIuYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIElmIHRoZSBvdGhlciBhdHRyIGlzIGRldGVybWluZWQgYXN5bmNocm5vdXNseSAoUHJvbWlzZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGB0aGlzLnJlc29sdmVBdHRyKCdhdHRyTmFtZScpYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbiBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHZhbHVlLlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEV4YW1wbGVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogICAgKCk9PlVzZXIuZ2V0KGlkOicxMjM0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6ICgpPT50aGlzLnJlc29sdmVBdHRyKCd1c2VyJykudGhlbih1c2VyPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbnRlcjogICAgICAtIGEgRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGlzIHN0YXRlIGlzIGVudGVyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKG9wdGlvbmFsKS5cblxuICAgICAgICAgICAgZXhpdDogICAgICAgLSBhIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhpcyBzdGF0ZSBpcyBleGl0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKG9wdGlvbmFsKS5cblxuICAgICAgICAgICAgZXZlbnRzOiAgICAgLSBhbiBPYmplY3QgbWFwIGRlZmluaW5nIGV2ZW50IGhhbmRsZXJzIChvcHRpb25hbCkuXG5cbiAgICAgICAgICAgIHN0YXRlczogICAgIC0gYW4gT2JqZWN0IG1hcCBkZWZpbmluZyBzdWItc3RhdGVzIChvcHRpb25hbCkuXG4gICovXG4gIGNvbnN0cnVjdG9yKHJvb3RTdGF0ZU9wdGlvbnMpe1xuICAgIHRoaXMuYXR0cnMgPSB7fTtcbiAgICB0aGlzLnJvb3RTdGF0ZSA9IG5ldyBTdGF0ZShudWxsLCB0aGlzLCByb290U3RhdGVPcHRpb25zKTtcbiAgfVxuXG4gIGdvdG8ocGF0aD0nLicsIHBhcmFtcz17fSl7XG4gICAgdGhpcy5yb290U3RhdGUuc2NTdGF0ZS5nb3RvKHBhdGgsIHtjb250ZXh0OnBhcmFtc30pO1xuICB9XG59XG5cbi8vIFRPRE8ocHdvbmcpOiBzaG91bGQgYmUgYGNvbnN0YCwgd2FpdGluZyBvbiB0cmFjZXVyIDAuMC42NiB1cGdyYWRlLlxudmFyIEVNUFRZX09CSiAgICA9IHt9O1xudmFyIE5PT1AgICAgICAgICA9ICgpPT4gRU1QVFlfT0JKO1xudmFyIG5leHRTdGF0ZVVJRCA9IDE7XG5cbmV4cG9ydCBmdW5jdGlvbiBhdHRyVmFsdWUodmFsKXtcbiAgaWYodGhpcyBpbnN0YW5jZW9mIGF0dHJWYWx1ZSlcbiAgICB0aGlzLnZhbCA9IHZhbDtcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgYXR0clZhbHVlKHZhbCk7XG59XG5cbi8vIEludGVybmFsOiBFbmNhcHN1bGF0aW9uIG9mIGEgU3RhdGUncyBhdHRycyBhbmQgYmVoYXZpb3IuICBXaXRoIGhlbHBlcnNcbi8vICAgICAgICAgICBmb3IgdHJhbnNpdGlvbmluZyBpbiBhbiBvdXQgb2YgdGhpcyBzdGF0ZS5cbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XG5cbiAgLy8gUHVibGljOiBDcmVhdGVzIGEgU3RhdGVcbiAgLy9cbiAgY29uc3RydWN0b3IoXG4gICAgcGFyZW50LFxuICAgIHN0YXRlQ2hhcnQsXG4gICAge2NvbmN1cnJlbnQsIGhpc3RvcnksIHBhcmFtcywgYXR0cnMsIGVudGVyLCBleGl0LCBldmVudHMsIHN0YXRlcywgZGVmYXVsdDpkZWZhdWx0U3RhdGV9LFxuICAgIG5hbWU9bmV4dFN0YXRlVUlEKytcbiAgKXtcbiAgICB0aGlzLnBhcmFtcyAgICAgPSBwYXJhbXM7XG4gICAgdGhpcy5zdGF0ZUNoYXJ0ID0gc3RhdGVDaGFydDtcbiAgICB0aGlzLmF0dHJzICAgICAgPSBhdHRycyB8fCBFTVBUWV9PQko7XG4gICAgdGhpcy5lbnRlciAgICAgID0gZW50ZXIgfHwgTk9PUDtcbiAgICB0aGlzLmV4aXQgICAgICAgPSBleGl0ICB8fCBOT09QO1xuXG4gICAgdmFyIHNjU3RhdGUgPSB0aGlzLnNjU3RhdGUgPSBzdGF0ZWNoYXJ0LlN0YXRlKG5hbWUsIHtcbiAgICAgIG5hbWUgICAgICAgOiBuYW1lLFxuICAgICAgY29uY3VycmVudCA6ICEhY29uY3VycmVudCxcbiAgICAgIGhpc3RvcnkgICAgOiAhIWhpc3RvcnlcbiAgICB9KTtcblxuICAgIGlmKHBhcmFtcylcbiAgICAgIHNjU3RhdGUuY2FuRW50ZXIgPSAoc3RhdGVzLCBwYXJhbXMpPT50aGlzLl9jYW5FbnRlcl9jaGVja1BhcmFtcyhwYXJhbXMpO1xuICAgIHNjU3RhdGUuZW50ZXIocGFyYW1zPT50aGlzLl9kb0VudGVyKHBhcmFtcykpO1xuICAgIHNjU3RhdGUuZXhpdCgoKT0+dGhpcy5fZG9FeGl0KCkpO1xuXG4gICAgaWYoZXZlbnRzKVxuICAgICAgT2JqZWN0LmtleXMoZXZlbnRzKS5cbiAgICAgICAgZm9yRWFjaChldmVudE5hbWU9PnNjU3RhdGUuZXZlbnQoZXZlbnROYW1lLCBldmVudHNbZXZlbnROYW1lXSkpXG5cbiAgICBpZihzdGF0ZXMpXG4gICAgICAvLyBBZGQgdGhlIGRlZmF1bHRTdGF0ZSBmaXJzdCwgc28gdGhlIHN0YXRlQ2hhcnQgZGVmYXVsdHMgdG8gdGhpcyBzdGF0ZVxuICAgICAgKGRlZmF1bHRTdGF0ZSAmJiBzdGF0ZXNbZGVmYXVsdFN0YXRlXSA/IFtkZWZhdWx0U3RhdGVdIDogW10pLlxuICAgICAgICBjb25jYXQoT2JqZWN0LmtleXMoc3RhdGVzKSkuXG4gICAgICAgIGZvckVhY2goc3RhdGVOYW1lPT5cbiAgICAgICAgICBzY1N0YXRlLmFkZFN1YnN0YXRlKFxuICAgICAgICAgICAgbmV3IFN0YXRlKFxuICAgICAgICAgICAgICB0aGlzLCBzdGF0ZUNoYXJ0LCBzdGF0ZXNbc3RhdGVOYW1lXSwgc3RhdGVOYW1lXG4gICAgICAgICAgICApLnNjU3RhdGVcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gIH1cblxuICBfc2V0QXR0clZhbHVlKG5hbWUsIHZhbCl7IHRoaXMuc3RhdGVDaGFydC5hdHRyc1tuYW1lXSA9IHZhbCB9XG5cbiAgX2NhbkVudGVyX2NoZWNrUGFyYW1zKHBhcmFtcyl7XG4gICAgaWYodGhpcy5wYXJhbXMpXG4gICAgICByZXR1cm4gcGFyYW1zID8gdGhpcy5wYXJhbXMuZXZlcnkocD0+cCBpbiBwYXJhbXMpIDogZmFsc2U7XG4gIH1cblxuICBfZG9FbnRlcl9zZXRBdHRycyhjb250ZXh0KXtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmF0dHJzKS5mb3JFYWNoKGE9PntcbiAgICAgIHZhciB2YWwgPSB0aGlzLmF0dHJzW2FdO1xuICAgICAgdmFsID0gKHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpID8gdmFsKGNvbnRleHQpIDogdmFsO1xuXG4gICAgICBpZighKHZhbCBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgICAgICB0aGlzLl9zZXRBdHRyVmFsdWUoYSwgKHZhbCBpbnN0YW5jZW9mIGF0dHJWYWx1ZSA/IHZhbC52YWwgOiB2YWwpKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsLnRoZW4odmFsdWU9PntcbiAgICAgICAgICBpZih0aGlzLnNjU3RhdGUuX19pc0N1cnJlbnRfXykgdGhpcy5fc2V0QXR0clZhbHVlKGEsIHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfZG9FbnRlcihjb250ZXh0KXtcbiAgICB0aGlzLl9kb0VudGVyX3NldEF0dHJzKGNvbnRleHQpO1xuICAgIHRoaXMuZW50ZXIoKTtcbiAgfVxuXG4gIF9kb0V4aXQoKXtcbiAgICB0aGlzLmV4aXQoKTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmF0dHJzKS5mb3JFYWNoKGE9PmRlbGV0ZSB0aGlzLnN0YXRlQ2hhcnQuYXR0cnNbYV0pO1xuICB9XG59XG4iLCJcbiAgICAgICAgJF9fZXhwb3J0KCRfX3BsYWNlaG9sZGVyX18wLCAkX19wbGFjZWhvbGRlcl9fMSlcbiAgICAgICIsInJldHVybiB7XG4gICAgICBzZXR0ZXJzOiAkX19wbGFjZWhvbGRlcl9fMCxcbiAgICAgIGV4ZWN1dGU6ICRfX3BsYWNlaG9sZGVyX18xXG4gICAgfSIsInZhciAkX19wbGFjZWhvbGRlcl9fMCA9ICRfX2V4cG9ydCgkX19wbGFjZWhvbGRlcl9fMSwgJF9fcGxhY2Vob2xkZXJfXzIpOyIsImZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciAkX19wbGFjZWhvbGRlcl9fMCA9ICRfX3BsYWNlaG9sZGVyX18xO1xuICAgICAgICAgIHJldHVybiAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKSgkX19wbGFjZWhvbGRlcl9fMiwgJF9fcGxhY2Vob2xkZXJfXzMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRfX3BsYWNlaG9sZGVyX180KTtcbiAgICAgICAgfSgpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9