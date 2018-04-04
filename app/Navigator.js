import React, { Component } from 'react';
import {
  StackNavigator,
  DrawerNavigator
} from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Feed from './containers/Feed';
import Queue from './containers/Queue';
import DrawerMenu from './DrawerMenu';

const Stack = StackNavigator(
  {
    Feed: { screen: Feed },
    Queue: { screen: Queue }
  },
  {
    initialRouteName: 'Queue',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#F2C94C',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }
);

export default DrawerNavigator(
  {
    Main: {
      screen: Stack
    }
  },
  {
    contentComponent: DrawerMenu,
    drawerWidth: 200
  }
);
