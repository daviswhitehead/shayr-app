import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
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
    onRefresh: PropTypes.func
  };

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.data}
        renderItem={({ item }) => this.props.renderItem(item)}
        keyExtractor={({ key }) => key}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onScroll={this.props.onScroll}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
        ListEmptyComponent={undefined} // to do: let the user know there are no posts
      />
    );
  }
}
