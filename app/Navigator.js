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
} from 'react-native';
import Feed from './containers/Feed';
import Queue from './containers/Queue';
import Share from './containers/Share';
import Login from './containers/Login';

const AuthStack = StackNavigator(
  {
    Login: Login
  },
  {
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
);
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