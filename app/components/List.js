import React, { Component } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import Swipeable from './Swipeable'
import ContentIcon from '../components/contentIcon/ContentIcon'

const extractKey = ({id}) => id

export default class List extends Component {
  constructor() {
    super();
    // console.log('hello');
    // console.log(this.props.items);
  }

  state = {
    rows: [
      { id: 0, text: 'View', contentType: 'link' },
      { id: 1, text: 'Text', contentType: 'podcast' },
      { id: 2, text: 'Image', contentType: 'television' },
      { id: 3, text: 'ScrollView', contentType: 'podcast' },
      { id: 4, text: 'ListView', contentType: 'link' },
      { id: 5, text: 'View', contentType: 'television' },
      { id: 6, text: 'Text', contentType: 'link' },
      { id: 7, text: 'Image', contentType: 'podcast' },
      { id: 8, text: 'ScrollView', contentType: 'podcast' },
      { id: 9, text: 'ListView', contentType: 'link' },
      { id: 10, text: 'View', contentType: 'television' },
      { id: 11, text: 'Text', contentType: 'link' },
      { id: 12, text: 'Image', contentType: 'link' },
      { id: 13, text: 'ScrollView', contentType: 'link' },
      { id: 14, text: 'ListView', contentType: 'link' },
    ]
  }

  renderItem = ({item}) => {
    const {rows} = this.state

    return (
      <Swipeable
        leftButtonWidth={75}
        leftButtons={[
          <TouchableOpacity
            style={[styles.leftSwipeItem, { backgroundColor: 'green' }]}
            onPress={() => this.setState({ rows: rows.filter((i) => i.id != item.id)})}
          >
            <Text>Done!</Text>
          </TouchableOpacity>,
        ]}
        rightContent={(
          <View style={[styles.rightSwipeItem, { backgroundColor: 'yellow' }]}>
            <Text>Share</Text>
          </View>
        )}
        onRightActionRelease={() => null} // add share action
      >
        <View style={styles.box}>
          <ContentIcon type={item.contentType}/>
          <Text style={styles.row}>
            {item.text}
          </Text>
        </View>
      </Swipeable>
    )
  }

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  render() {
    console.log(this.props.items);
    return (
      <FlatList
        style={styles.container}
        data={this.state.rows}
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
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E8E8E8',
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },
})
