import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class HamburgerMenu extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{ paddingHorizontal: 10 }}>
        <TouchableOpacity
          onPress={() => this.props.nav.navigate('DrawerOpen')}
        >
          <Icon name='menu' size={30} color='black' />
        </TouchableOpacity>
      </View>
    )
  }
}
