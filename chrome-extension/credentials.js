// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
  //MAIN APP
  apiKey: "AIzaSyBvI-n0UEfUQRd4eJop_SidnLLKotCpav8",
  authDomain: "shayr-a2346.firebaseapp.com",
  databaseURL: "https://shayr-a2346.firebaseio.com",
  projectId: "shayr-a2346",
  storageBucket: "shayr-a2346.appspot.com",
  messagingSenderId: "661227708394"
  //DEV APP
    // apiKey: "AIzaSyCfLNNY-bTcuw27OHTwgh2Y_iIh6owv5oY",
    // authDomain: "shayr-dev.firebaseapp.com",
    // databaseURL: "https://shayr-dev.firebaseio.com",
    // projectId: "shayr-dev",
    // storageBucket: "shayr-dev.appspot.com",
    // messagingSenderId: "552894174549"
};
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      const ts = firebase.firestore.FieldValue.serverTimestamp();
      const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
      ref.set({
        createdAt: ts,
        updatedAt: ts,
        firstName: displayName.split(" ")[0],
        lastName: displayName.split(" ")[1],
        email: email,
        facebookProfilePhoto: photoURL,
      });
      // [START_EXCLUDE]
      document.getElementById('login-button').textContent = 'Sign Out';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-account-details').textContent = user.email;
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById('login-button').textContent = 'Sign In';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = '';
      // [END_EXCLUDE]
    }
    document.getElementById('login-button').disabled = false;
  });
  // [END authstatelistener]

  document.getElementById('login-button').addEventListener('click', startSignIn, false);
  document.getElementById('shayr-button').addEventListener('click', shayrPage, false);

}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.

  firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch(function (error) {
    // An error happened.
    if (error.code === 'auth/account-exists-with-different-credential') {
      // Step 2.
      // User's email already exists.
      // The pending Facebook credential.
      var pendingCred = error.credential;
      // The provider account's email address.
      var email = error.email;
      // Get sign-in methods for this email.
      firebase.auth().fetchSignInMethodsForEmail(email).then(function (methods) {
        console.log(methods);
        // Step 3.
        // If the user has several sign-in methods,
        // the first method in the list will be the "recommended" method to use.
        if (methods[0] === 'google.com') {
          // Asks the user to validate link to google
          // TODO: make async
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider).then(function (result) {
            // Step 4a.
            return result.user.linkWithCredential(pendingCred);
          });
          return;
        }
      });
    }
  });
};

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  document.getElementById('login-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
};

const getTab = () =>
  new Promise(resolve => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      tabs => resolve(tabs[0])
    );
  });





function shayrPage() {
  if (firebase.auth().currentUser) {
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);

    const createShare = (ref, url) => ref
      .collection('inboundShares')
      .add({
        createdAt: ts,
        updatedAt: ts,
        url
      })
      .then((ref) => {
        console.log('createShare success');
        return true;
      })
      .catch((error) => {
        console.error(error);
      });
    getTab().then(tab => {
      // Connects to tab port to enable communication with inContent.js
      const share = createShare(ref, tab.url);
      console.log(tab.url);
    });
  }



}

window.onload = function() {
  initApp();
};


