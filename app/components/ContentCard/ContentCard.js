import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import PropTypes from "prop-types";

import styles from "./styles";
import article from "../../assets/Article.png";
// import isURL from '../../lib/Utils'; check to make sure url is openable
import ActionCounter from "../ActionCounter";

import _ from "lodash";

export default class ContentCard extends Component {
  static propTypes = {
    payload: PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      publisher: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string
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
      url: PropTypes.string.isRequired
    }),
    friends: PropTypes.shape({
      friendId: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        facebookProfilePhoto: PropTypes.string
      })
    })
  };

  static defaultProps = {
    payload: {
      image: "missing",
      title: "missing",
      publisher: {
        name: "missing",
        logo: "missing"
      },
      shares: [],
      medium: "missing",
      shareCount: 0,
      url: "missing"
    },
    friends: {
      firstName: "missing",
      lastName: "missing",
      facebookProfilePhoto: "missing"
    }
  };

  combine = () => {
    let data = {
      image: this.props.payload.image,
      title: this.props.payload.title,
      publisher: this.props.payload.publisher,
      url: this.props.payload.url
    };
    let featuredUserId = "";
    let featuredType = "";
    if (this.props.payload.shares) {
      featuredUserId = this.props.payload.shares[0];
      featuredType = "shayred";
    } else if (this.props.payload.adds) {
      featuredUserId = this.props.payload.adds[0];
      featuredType = "added";
    } else if (this.props.payload.dones) {
      featuredUserId = this.props.payload.dones[0];
      featuredType = "checked";
    } else if (this.props.payload.likes) {
      featuredUserId = this.props.payload.likes[0];
      featuredType = "liked";
    }

    if (featuredUserId && featuredType) {
      (data["facebookProfilePhoto"] = _.get(
        this.props.friends,
        [featuredUserId, "facebookProfilePhoto"],
        "missing"
      )),
        (data["firstName"] = _.get(
          this.props.friends,
          [featuredUserId, "firstName"],
          "missing"
        )),
        (data["lastName"] = _.get(
          this.props.friends,
          [featuredUserId, "lastName"],
          "missing"
        )),
        (data["featureType"] = featuredType);
    }

    return data;
  };

  render() {
    const data = this.combine();

    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onTap(this.props.payload.url)}
      >
        <View style={styles.cardBox}>
          <View style={styles.headerBox}>
            <View style={styles.profileImageBox}>
              {data.facebookProfilePhoto ? (
                <Image
                  style={styles.profileImage}
                  source={{ uri: data.facebookProfilePhoto }}
                />
              ) : (
                <Image style={styles.profileImage} source={article} />
              )}
            </View>
            <View style={styles.profileNameBox}>
              <Text style={styles.profileName}>
                {data.firstName} {data.lastName} {data.featureType}
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
                <Text style={styles.titleText}>{data.title}</Text>
                <Text style={styles.publisherText}>{data.publisher.name}</Text>
              </View>
              <View style={styles.actionsBox}>
                <ActionCounter
                  actionType={"share"}
                  {...this.props.shareAction}
                />
                <ActionCounter actionType={"add"} {...this.props.addAction} />
                <ActionCounter actionType={"done"} {...this.props.doneAction} />
                <ActionCounter actionType={"like"} {...this.props.likeAction} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
