import React, { Component } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import ContentCard from '../ContentCard';

import styles from './styles';
import SwipeCard from '../SwipeCard';


export default class List extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    swipeLeftToRightUI: PropTypes.func,
    swipeLeftToRightAction: PropTypes.func,
    swipeRightToLeftUI: PropTypes.func,
    swipeRightToLeftAction: PropTypes.func,
    onScroll: PropTypes.func,
    onEndReached: PropTypes.func,
    onRefresh: PropTypes.func,
  };

  extractKey = ({key}) => key;

  renderItem = ({item}) => {
    return (
      <View style={styles.box}>
        <SwipeCard
          card={<ContentCard payload={item} />}
          swipeLeftToRightUI={this.props.swipeLeftToRightUI}
          swipeLeftToRightAction={this.props.swipeLeftToRightAction}
          swipeRightToLeftUI={this.props.swipeRightToLeftUI}
          swipeRightToLeftAction={this.props.swipeRightToLeftAction}
        />
      </View>
    )
  };
  // renderItem = ({item}) => {
  //   return (
  //     <View style={styles.box}>
  //       <SwipeCard
  //         payload={item}
  //         swipeLeftToRightUI={this.props.swipeLeftToRightUI}
  //         swipeLeftToRightAction={this.props.swipeLeftToRightAction}
  //         swipeRightToLeftUI={this.props.swipeRightToLeftUI}
  //         swipeRightToLeftAction={this.props.swipeRightToLeftAction}
  //       />
  //     </View>
  //   )
  // };

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
        keyExtractor={this.extractKey}
        ItemSeparatorComponent={this.renderSeparator}
        onScroll={this.props.onScroll}
        onEndReached={this.props.onEndReached}
        onEndThreshold={0.25}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
      />
    );
  }
}
