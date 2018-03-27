import React, { Component } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import ContentCard from './ContentCard'

const extractKey = ({id}) => id

export default class List extends Component {
  constructor() {
    super();
  }

  renderItem = ({item}) => {
    const {rows} = this.props.data

    return (
      <View style={styles.box}>
        <ContentCard
          payload={item}
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
    console.log(this.state);
    console.log(this.props);
    return (
      <ContentCard
      />
    );
  }
  // render() {
  //   return (
  //     <FlatList
  //       style={styles.container}
  //       data={this.props.data}
  //       renderItem={this.renderItem}
  //       keyExtractor={extractKey}
  //       ItemSeparatorComponent={this.renderSeparator}
  //     />
  //   );
  // }
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
