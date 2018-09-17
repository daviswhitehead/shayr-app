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
import styles from './styles';


export default class List extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    onScroll: PropTypes.func,
    onEndReached: PropTypes.func,
    onRefresh: PropTypes.func,
  };

  extractKey = ({key}) => {
    return key;
  }

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  renderItem = ({item}) => {
    return (
      <View style={styles.box}>
        {this.props.renderItem(item)}
      </View>
    )
  }

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
