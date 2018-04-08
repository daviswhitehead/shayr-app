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

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
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
    initialRouteName: 'App',
  }
);