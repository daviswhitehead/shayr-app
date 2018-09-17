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
// import isURL from '../../lib/Utils'; check to make sure url is openable
import ActionCounter from '../ActionCounter';

import _ from 'lodash';

export default class ContentCard extends Component {
  constructor() {
    super();
    this.data = {
      image: '',
      publisherName: 'Missing',
      title: 'Missing',
      sharedBy: {
        facebookProfilePhoto: '',
        firstName: 'Missing',
        lastName: 'Missing',
      },
      medium: 'Missing',
      shareCount: 0,
      addCount: 0,
      doneCount: 0,
      likeCount: 0
    }
    this.contentImage = false
    this.profileImage = false
  }

  static propTypes = {
    payload: PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      publisherName: PropTypes.string,
      sharedBy: PropTypes.shape({
        facebookProfilePhoto: PropTypes.string,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }),
      medium: PropTypes.string.isRequired,
      shares: PropTypes.shape({
        count: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    shareAction: PropTypes.shape({
      actionCount: PropTypes.number.isRequired,
      actionUser: PropTypes.bool.isRequired,
    })
  };

  static defaultProps = {
    payload: {
      image: '',
      publisherName: 'Missing',
      title: 'Missing',
      sharedBy: {
        facebookProfilePhoto: '',
        firstName: 'Missing',
        lastName: 'Missing',
      },
      medium: 'Missing',
      shares: {
        count: 0,
        user: false,
      },
      adds: {
        count: 0,
        user: false,
      },
      dones: {
        count: 0,
        user: false,
      },
      likes: {
        count: 0,
        user: false,
      },
    }
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

    if (_.get(data, 'image', false)) {
      this.contentImage = true
    }
    if (_.get(data, 'sharedBy.facebookProfilePhoto', false)) {
      // this.profileImage = true
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
    this.data = {
      ...this.data,
      ...data
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => this.tap(this.props.payload)}
      >
        <View style={styles.cardBox}>
          <View style={styles.headerBox}>
            <View style={styles.profileImageBox}>

              { this.profileImage
                ? <Image
                  style={styles.profileImage}
                  source={{uri: this.data.sharedBy.facebookProfilePhoto}}
                />
                : <Image
                  style={styles.profileImage}
                  source={article}
                />
              }
            </View>
            <View style={styles.profileNameBox}>
              <Text style={styles.profileName}>
                {this.data.sharedBy.firstName} {this.data.sharedBy.lastName}
              </Text>
            </View>
          </View>
          <View style={styles.contentBox}>
            <View style={styles.imageBox}>
              { this.contentImage
                ? <Image
                  style={styles.image}
                  source={{uri: this.data.image}}
                />
                : <Image
                  style={styles.image}
                  source={article}
                />
              }
            </View>
            <View style={styles.textActionsBox}>
              <View style={styles.textBox}>
                <Text
                  style={styles.titleText}>
                  {this.data.title}
                </Text>
                <Text
                  style={styles.publisherText}>
                  {this.data.publisherName}
                </Text>
              </View>
              <View style={styles.actionsBox}>
                <ActionCounter
                  actionType={'share'}
                  {...this.props.shareAction}
                />
                <ActionCounter
                  actionType={'add'}
                  {...this.props.addAction}
                />
                <ActionCounter
                  actionType={'done'}
                  {...this.props.doneAction}
                />
                <ActionCounter
                  actionType={'like'}
                  {...this.props.likeAction}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
