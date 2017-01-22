import '../../vendor/octicons/octicons.css';
import '../css/colors.css';
import '../css/flex.css';
import '../css/icons.css';
import '../css/layout.css';
import '../css/link.css';
import '../css/reset.css';
import '../css/text.css';

import './App.css';

import xvdom      from 'xvdom';
import Icon       from './common/Icon.jsx';
import Tabs       from './common/Tabs.jsx';
import DB         from '../models/DB';
import User       from '../models/User';
import AppToolbar from './AppToolbar.jsx';
import OutfitList from './OutfitList.jsx';

import '../helpers/installServiceWorker';
import '../helpers/globalLogger';

function toggleSignIn() {
  if (firebase.auth().currentUser) {
    User.unsetCurrent();
    return firebase.auth().signOut();
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/plus.login');
  firebase.auth()
    .signInWithPopup(provider)
    .catch(error => console.error(error));
}

const TABS = {
  uncategorized:{
    title: 'Uncategorized',
    view: id => <div>Hello</div>
  },
  yup:{
    title: 'Yup',
    view: id => <div>Hello</div>
  },
  nope:{
    title: 'Nope',
    view: id => <div>Hello</div>
  },
  maybe:{
    title: 'Maybe',
    view: id => <div>Hello</div>
  }
};

const App = ({ props: { user, db }, state: { category } }) => (
  <body>
    <AppToolbar
      left={
        <Icon
          className='c-white l-padding-h4'
          name='three-bars'
          size='small'
        />
      }
      secondary={
        <Tabs hrefPrefix='#' selected={category} tabs={TABS} />
      }
      title='OK'
    />
    <button onclick={toggleSignIn}>{user ? 'Sign out' : 'Sign in'}</button>
    {user && db && <OutfitList category={category} db={db} user={user} />}
  </body>
);

const getCategoryFromHash = () => window.location.hash.slice(1) || 'uncategorized';

const stateFromHash = ({ state }) => ({
  category: getCategoryFromHash() || (state && state.category)
});

App.state = {
  onInit: ({ bindSend }) => {
    window.onhashchange = bindSend('handleHashChange');
    return stateFromHash({});
  },
  onProps: stateFromHash,
  handleHashChange: stateFromHash
}

const renderApp = (user, db) => <App user={user} db={db} />;

firebase.initializeApp({
  apiKey: "AIzaSyBOWk2fU2p4Br1agfu25gY5NGYXy0ZDyS0",
  authDomain: "outfit-knockout-ef20f.firebaseapp.com",
  databaseURL: "https://outfit-knockout-ef20f.firebaseio.com",
  storageBucket: "outfit-knockout-ef20f.appspot.com"
});

DB.get().then(db => {
  document.body = xvdom.render(renderApp(User.current(), db));

  firebase.auth().onAuthStateChanged(authUser => {
    if(!authUser) return xvdom.rerender(document.body, renderApp(null, null));

    // Get or create user information
    User.get(authUser.uid)
      .catch(() =>
        User.save({
          // Couldn't find existing user w/authId, so create a new User
          id: authUser.uid,
          displayName: authUser.displayName,
          excludedCombos: {},
          yup: {},
          nope: {},
          maybe: {}
        })
      )
      .then(user => {
        User.setCurrent(user.id);
        xvdom.rerender(document.body, renderApp(user, db));
      })
  });
})
