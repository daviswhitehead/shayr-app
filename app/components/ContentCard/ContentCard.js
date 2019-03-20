import React, { Component } from 'react';
import {
  Text, View, Image, TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles';
import article from '../../assets/Article.png';
import PostAction from '../PostAction';
import FontHeadingTwo from '../FontHeadingTwo';
import FontSubHeading from '../FontSubHeading';

export default class ContentCard extends Component {
  static propTypes = {
    payload: PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      publisher: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string,
      }),
      shares: PropTypes.arrayOf(PropTypes.string),
      adds: PropTypes.arrayOf(PropTypes.string),
      dones: PropTypes.arrayOf(PropTypes.string),
      likes: PropTypes.arrayOf(PropTypes.string),
      medium: PropTypes.string,
      shareCount: PropTypes.number,
      addCount: PropTypes.number,
      doneCount: PropTypes.number,
      likeCount: PropTypes.number,
      url: PropTypes.string.isRequired,
    }),
    friends: PropTypes.shape({
      friendId: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        facebookProfilePhoto: PropTypes.string,
      }),
    }).isRequired,
  };

  static defaultProps = {
    payload: {
      publisher: {
        name: '',
        logo: '',
      },
    },
  };

  combine = () => {
    const data = {
      image: this.props.payload.image,
      title: this.props.payload.title,
      publisher: this.props.payload.publisher,
      url: this.props.payload.url,
    };
    if (!data.publisher.name) {
      data.publisher = {
        name: '',
        logo: '',
      };
    }
    let featuredUserId = '';
    let featuredType = '';
    if (this.props.payload.shares) {
      featuredUserId = this.props.payload.shares[0];
      featuredType = 'shayred';
    } else if (this.props.payload.adds) {
      featuredUserId = this.props.payload.adds[0];
      featuredType = 'added';
    } else if (this.props.payload.dones) {
      featuredUserId = this.props.payload.dones[0];
      featuredType = 'checked';
    } else if (this.props.payload.likes) {
      featuredUserId = this.props.payload.likes[0];
      featuredType = 'liked';
    }

    if (featuredUserId && featuredType) {
      data.facebookProfilePhoto = _.get(
        this.props.friends,
        [featuredUserId, 'facebookProfilePhoto'],
        'missing',
      );
      data.firstName = _.get(this.props.friends, [featuredUserId, 'firstName'], 'missing');
      data.lastName = _.get(this.props.friends, [featuredUserId, 'lastName'], 'missing');
      data.featureType = featuredType;
    }

    return data;
  };

  render() {
    const data = this.combine();

    return (
      <TouchableWithoutFeedback onPress={() => this.props.onTap(this.props.payload.url)}>
        <View style={styles.cardBox}>
          <View style={styles.headerBox}>
            <View style={styles.profileImageBox}>
              {data.facebookProfilePhoto ? (
                <Image style={styles.profileImage} source={{ uri: data.facebookProfilePhoto }} />
              ) : (
                <Image style={styles.profileImage} source={article} />
              )}
            </View>
            <View style={styles.profileNameBox}>
              <Text style={styles.profileName}>
                {data.firstName}
                {' '}
                {data.lastName}
                {' '}
                {data.featureType}
              </Text>
            </View>
          </View>
          <View style={styles.contentBox}>
            <View style={styles.imageBox}>
              {data.image ? (
                <Image style={styles.image} source={{ uri: data.image }} />
              ) : (
                <Image style={styles.image} source={article} />
              )}
            </View>
            <View style={styles.textActionsBox}>
              <View style={styles.textBox}>
                <FontHeadingTwo text={data.title} />
                <FontSubHeading text={data.publisher.name} />
              </View>
              <View style={styles.actionsBox}>
                <PostAction actionType="share" {...this.props.shareAction} />
                <PostAction actionType="add" {...this.props.addAction} />
                <PostAction actionType="done" {...this.props.doneAction} />
                <PostAction actionType="like" {...this.props.likeAction} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
