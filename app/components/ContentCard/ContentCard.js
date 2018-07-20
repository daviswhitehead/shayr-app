import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import article from '../../assets/Article.png';

import _ from 'lodash';

export default class ContentCard extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    payload: PropTypes.object.isRequired
  };

  sanitizeData = (payload) => {
    const data = {
      image: _.get(payload, 'image', ''),
      publisherName: _.get(payload, 'publisher.name', 'Error: Missing Publisher'),
      title: _.get(payload, 'title', 'Error: Missing Title'),
      sharedBy: _.get(payload, 'sharedBy', ''),
      shareCount: _.get(payload, 'shareCount', '')
    }
    if (data['sharedBy']['firstName'] && data['sharedBy']['lastName']) {
      data['sharedByFriend'] = data['sharedBy']['firstName'] + ' ' + data['sharedBy']['lastName']
      data['shareCount'] = data['shareCount'] - 1
    } else {
      data['sharedByFriend'] = false
    }

    if (data['shareCount'] > 1) {
      data['sharedByOther'] = data['shareCount'] + ' others'
    } else if (data['shareCount'] == 1) {
      data['sharedByOther'] = data['shareCount'] + ' other'
    } else if (!data['shareCount'] || data['shareCount'] == 0) {
      data['sharedByOther'] = false
    }

    if (data['sharedByFriend'] && data['sharedByOther']) {
      data['sharedBy'] = 'Shared by ' + data['sharedByFriend'] + ' and ' + data['sharedByOther']
    } else if (data['sharedByFriend'] && !data['sharedByOther']) {
      data['sharedBy'] = 'Shared by ' + data['sharedByFriend']
    } else if (!data['sharedByFriend'] && data['sharedByOther']) {
      data['sharedBy'] = 'Shared by ' + data['sharedByOther']
    } else {
      data['sharedBy'] = ''
    }

    return data
  }

  tap = (payload) => {
    const url = payload['url']
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  render() {
    const data = this.sanitizeData(this.props.payload);
    return (
      <TouchableWithoutFeedback
        onPress={() => this.tap(this.props.payload)}
      >
        <View style={styles.card}>
          <View
            style={styles.imageBox}
          >
            <Image
              style={styles.image}
              source={{uri: data.image}}
              defaultSource={article}
            />
            <View
              style={styles.triangleCorner}
            />
          </View>
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
      </TouchableWithoutFeedback>
    );
  }
}
