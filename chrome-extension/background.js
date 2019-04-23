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

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });

  // const ts = firebase.firestore.FieldValue.serverTimestamp();
  // firebase.firestore().collection('inboundShares')
  //   .add({
  //     createdAt: ts,
  //     updatedAt: ts,
  //     url,
  //   })
  //   .then((ref) => {
  //     console.log('createShare success');
  //     return true;
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

}

window.onload = function() {
  initApp();
};

