import React, { Component } from "react";
import { Text, View, Image, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";

import {
  newAction,
  toggleAction
} from "../../redux/postActions/PostActionsActions";

import styles from "./styles";

import shareActive from "../../assets/shareActive/shareActive.png";
import shareInactive from "../../assets/shareInactive/shareInactive.png";
import shareUser from "../../assets/shareUser/shareUser.png";

import addActive from "../../assets/addActive/addActive.png";
import addInactive from "../../assets/addInactive/addInactive.png";
import addUser from "../../assets/addUser/addUser.png";

import doneActive from "../../assets/doneActive/doneActive.png";
import doneInactive from "../../assets/doneInactive/doneInactive.png";
import doneUser from "../../assets/doneUser/doneUser.png";

import likeActive from "../../assets/likeActive/likeActive.png";
import likeInactive from "../../assets/likeInactive/likeInactive.png";
import likeUser from "../../assets/likeUser/likeUser.png";

const icons = {
  share: {
    active: shareActive,
    inactive: shareInactive,
    user: shareUser
  },
  add: {
    active: addActive,
    inactive: addInactive,
    user: addUser
  },
  done: {
    active: doneActive,
    inactive: doneInactive,
    user: doneUser
  },
  like: {
    active: likeActive,
    inactive: likeInactive,
    user: likeUser
  }
};

export default class ActionCounter extends Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionCount: PropTypes.number.isRequired,
    actionUser: PropTypes.bool.isRequired,
    onTap: PropTypes.func.isRequired
  };

  static defaultProps = {
    actionType: null,
    actionCount: 0,
    actionUser: false
  };

  getIconState = (count, user) => {
    let iconState = "inactive";
    let showCount = false;

    if (count > 0) {
      iconState = "active";
      showCount = true;
    }

    if (user) {
      iconState = "user";
    }

    return [iconState, showCount];
  };

  render() {
    if (!icons.hasOwnProperty(this.props.actionType)) {
      return (
        <View style={styles.container}>
          <View style={styles.iconLoading} />
        </View>
      );
    }
    const [iconState, showCount] = this.getIconState(
      this.props.actionCount,
      this.props.actionUser
    );

    const icon = icons[this.props.actionType][iconState];
    const count = showCount ? this.props.actionCount : "";

    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onTap()}
        // onPress={() => console.log('hello')}
      >
        <View style={styles.container}>
          <Image style={styles.icon} source={icon} />
          <Text style={styles.count}>{count}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
