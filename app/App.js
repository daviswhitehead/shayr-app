import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import Feed from './containers/Feed';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'

// Calling the following function will open the FB login dialogue:
const facebookLogin = () => {
  return LoginManager
    .logInWithReadPermissions(['public_profile', 'email'])
    .then((result) => {
      if (!result.isCancelled) {
        console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`)
        // get the access token
        return AccessToken.getCurrentAccessToken()
      }
    })
    .then(data => {
      if (data) {
        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
        // login with credential
        return firebase.auth().signInWithCredential(credential)
      }
    })
    .then((currentUser) => {
      if (currentUser) {
        console.info(JSON.stringify(currentUser.toJSON()))
      }
    })
    .catch((error) => {
      console.log(`Login fail with error: ${error}`)
    })
};

const test = (url) => {
  this.shares = firebase.firestore().collection('shares');
  this.ts = firebase.firestore.FieldValue.serverTimestamp();
  console.log(this.shares);
  console.log(urls);
  console.log(ts);

  this.shares.doc().set({
    created_at: this.ts,
    updated_at: this.ts,
    url: url
  })
  .then(function() {
      console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });

};

const urls = [
  'https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html',
  'https://www.netflix.com/title/80057281?s=i&trkid=14170035',
  'https://medium.com/astro-hq/camera-button-ba3d8c493cbd?source=userActivityShare-83495be9bdeb-1512935319',
  'https://itunes.apple.com/us/podcast/this-american-life/id201671138?mt=2&i=1000395571218',
  'https://allrecipes.com/recipe/12409/apple-crisp-ii/',
  'https://www.rottentomatoes.com/m/coco_2017',
  'https://www.amazon.com/Habits-Highly-Effective-People-Anniversary/dp/1511317299',
  'https://www.youtube.com/watch?v=r0IQCLQDfKw',
  'https://open.spotify.com/album/3pWJFrSX6apPzt4inM4zXt',
  'https://www.reddit.com/r/worldnews/comments/7iv6s9/amazon_drivers_are_asked_to_deliver_up_to_200/',
]

// for (var url of urls) {
//    console.log(url);
//    test(url);
// };
test('https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html');

export default class App extends Component {
  render() {
    // facebookLogin();
    return (
      <Feed/>
    )
  }
}
