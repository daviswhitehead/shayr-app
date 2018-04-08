import React, { Component } from 'react';
import {
  StackNavigator,
  DrawerNavigator,
  SwitchNavigator
} from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
  StatusBar,
  AsyncStorage
} from 'react-native';
import Feed from './containers/Feed';
import Queue from './containers/Queue';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };


  // Calling the following function will open the FB login dialogue:
  _facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw new Error('User cancelled request'); // Handle this however fits the flow of your app
      }

      console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

      // login with credential
      const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);

      console.info(JSON.stringify(currentUser.user.toJSON()))
      this.props.navigation.navigate('App');

    } catch (e) {
      console.error(e);
    }
  }

render() {
  return (
    <View>
      <Button title="Login" onPress={this._facebookLogin} />
    </View>
  );

  }
}

const AuthStack = StackNavigator({ SignIn: SignInScreen });
const AppStack = StackNavigator(
  {
    Feed: { screen: Feed },
    Queue: { screen: Queue }
  },
  {
    initialRouteName: 'Feed',
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#F2C94C',
      },
      headerTitleStyle: {
        fontWeight: '800',
      },
      headerTintColor: 'black',
      headerBackTitle: null,
      headerLeft: null
    })
  }
);

export default SwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
  }
);