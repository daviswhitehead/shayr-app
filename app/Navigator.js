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

export default StackNavigator(
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
