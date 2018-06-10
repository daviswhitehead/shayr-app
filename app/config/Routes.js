import React, { Component } from 'react';
import {
  StackNavigator,
  SwitchNavigator
} from 'react-navigation';
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 3,
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
