import React, { Component } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import _ from 'lodash';

export default class List extends Component {
  constructor() {
    super();
  }

  sanitizeData = (payload) => {
    const data = {
      image: _.get(payload, 'image', require('./Article.png')),
      publisherName: _.get(payload, 'publisher.name', 'Error: Missing Publisher'),
      title: _.get(payload, 'title', 'Error: Missing Title'),
      friend: {
        firstName: _.get(payload, 'friend.firstName', ''),
        lastName: _.get(payload, 'friend.lastName', '')
      },
      shareCount: _.get(payload, 'shareCount', '')
    }
    if (data.friend.firstName && data.friend.lastName && data.shareCount) {
      data['sharedBy'] = 'Shared by ' + data.friend.firstName + ' ' + data.friend.lastName + ' and ' + data.shareCount + ' others'
    }
    else if (data.friend.firstName && data.friend.lastName && !data.shareCount) {
      data['sharedBy'] = 'Shared by ' + data.friend.firstName + ' ' + data.friend.lastName
    }
    else if ((!data.friend.firstName || !data.friend.lastName) && data.shareCount) {
      data['sharedBy'] = 'Shared by ' + data.shareCount + ' others'
    }
    else {
      data['sharedBy'] = ''
    }
    return data
  }

  render() {
    const data = this.sanitizeData(this.props.payload);
    return (
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={{uri: data.image}}
        />
        <View style={styles.textBox}>
          <View style={styles.titlePublisherBox}>
            <Text
              style={styles.titleText}>
              {data.title}
            </Text>
            <Text
              style={styles.publisherText}>
              {data.publisherName}
            </Text>
          </View>
          <View style={styles.sharedByBox}>
            <Text
              style={styles.sharedByText}>
              {data.sharedBy}
            </Text>
          </View>
        </View>
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
    // 70% mask
  },
  textBox: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginLeft: 10,
  },
  titlePublisherBox: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sharedByBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontWeight: 'bold',
  },
  publisherText: {
    fontWeight: 'normal',
  },
  sharedByText: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: '#F2C94C',
  },
})
