import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Discover from '../../containers/Discover';
import Friends from '../../containers/Friends';
import MyList from '../../containers/MyList';
import globalRouter from '../TempRouter/RouterSingleton';

export class TabBar extends Component {
  onDiscoverPress = () => {
    globalRouter.push({ component: Discover });
  };
  onMyListPress = () => {
    globalRouter.push({ component: MyList });
  };
  onFriendsPress = () => {
    globalRouter.push({ component: Friends });
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'blue',
          marginBottom: 40,
          paddingHorizontal: 40
        }}
      >
        <TouchableOpacity onPress={this.onDiscoverPress}>
          <Text> Discover </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onMyListPress}>
          <Text> MyList </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onFriendsPress}>
          <Text> Friends </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default TabBar;
