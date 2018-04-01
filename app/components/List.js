import React, { Component } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import SwipeCard from './SwipeCard';


const extractKey = ({key}) => key

export default class List extends Component {
  constructor() {
    super();
  }

  renderItem = ({item}) => {
    const {
      swipeLeftToRightUI,
      swipeLeftToRightAction,
      swipeRightToLeftUI,
      swipeRightToLeftAction
    } = this.props
    return (
      <View style={styles.box}>
        <SwipeCard
          payload={item}
          swipeLeftToRightUI={swipeLeftToRightUI}
          swipeLeftToRightAction={swipeLeftToRightAction}
          swipeRightToLeftUI={swipeRightToLeftUI}
          swipeRightToLeftAction={swipeRightToLeftAction}
        />
      </View>
    )
  }

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.data}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E8E8E8',
  },
})
