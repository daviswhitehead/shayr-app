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
import isURL from '../../lib/Utils';

import _ from 'lodash';

export default class ContentCard extends Component {
  constructor() {
    super();
    this.data = {
      image: article,
      publisherName: 'Missing',
      title: 'Missing',
      sharedByImage: article,
      sharedByFirstName: 'Missing',
      sharedByLastName: 'Missing',
      medium: 'Missing',
      medium: 'Missing',
      shareCount: 0,
      addCount: 0,
      doneCount: 0,
      likeCount: 0
    }
    this.defaultImage = true
  }

  static propTypes = {
    payload: PropTypes.object.isRequired
  };

  sanitizeData = (payload) => {
    const data = {
      image: _.get(payload, 'image', false),
      publisherName: _.get(payload, 'publisher.name', false),
      title: _.get(payload, 'title', false),
      sharedBy: _.get(payload, 'sharedBy', false),
      shareCount: _.get(payload, 'shareCount', false)
    }
    for (var item in data) {
      if (data.hasOwnProperty(item) && !data[item]) {
        delete data[item]
      }
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
    console.log(data);
    this.data = {
      ...this.data,
      ...data
    }
    console.log(this.data);
    if (this.data.image) {
      this.defaultImage = false
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => this.tap(this.props.payload)}
      >
        <View style={styles.card}>
          <View
            style={styles.imageBox}
          >
            { this.defaultImage
              ? <Image
                style={styles.image}
                source={article}
              />
              : <Image
                style={styles.image}
                source={{uri: this.data.image}}
              />
            }
            <View
              style={styles.triangleCorner}
            />
          </View>
          <View style={styles.textBox}>
            <View style={styles.titlePublisherBox}>
              <Text
                style={styles.titleText}>
                {this.data.title}
              </Text>
              <Text
                style={styles.publisherText}>
                {this.data.publisherName}
              </Text>
            </View>
            <View style={styles.sharedByBox}>
              <Text
                style={styles.sharedByText}>
                {this.data.sharedByFirstName} {this.data.sharedByFirstName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
