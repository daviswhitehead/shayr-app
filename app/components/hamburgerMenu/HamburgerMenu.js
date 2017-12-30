import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';

export default class HamburgerMenu extends Component {
  render() {
    return (
      <View>
        <Image source={require('./HamburgerMenu.png')}/>
      </View>
    )
  }
}
