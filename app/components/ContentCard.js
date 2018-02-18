import React, { Component } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

export default class List extends Component {
  constructor() {
    super();
  }

  state = {
    data: [
      {
        id: 0,
        image: 'https://static01.nyt.com/images/2017/12/11/us/11alabama-alpha/11alabama-alpha-facebookJumbo.jpg',
        title: 'liberal outsiders pour into alabama senate race, treading lightly',
        publisher: 'nytimes',
        sharer: 'davis'
      }
    ]
  }

  render() {
    console.log(this.props.items);
    return (
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={{uri: 'https://static01.nyt.com/images/2017/12/11/us/11alabama-alpha/11alabama-alpha-facebookJumbo.jpg'}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,

  },
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginLeft: 10,
  },
})
