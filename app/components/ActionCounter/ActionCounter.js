import React, { Component } from 'react';
import {
  View,
  Image,
  // TouchableWithoutFeedback, add touching
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

import shayrActive from '../../assets/shayrActive/shayrActive.png';
import shayrInactive from '../../assets/shayrInactive/shayrInactive.png';
import shayrUser from '../../assets/shayrUser/shayrUser.png';

import addActive from '../../assets/addActive/addActive.png';
import addInactive from '../../assets/addInactive/addInactive.png';
import addUser from '../../assets/addUser/addUser.png';

import doneActive from '../../assets/doneActive/doneActive.png';
import doneInactive from '../../assets/doneInactive/doneInactive.png';
import doneUser from '../../assets/doneUser/doneUser.png';

import likeActive from '../../assets/likeActive/likeActive.png';
import likeInactive from '../../assets/likeInactive/likeInactive.png';
import likeUser from '../../assets/likeUser/likeUser.png';

export default class ActionCounter extends Component {
  constructor() {
    super();
    this.iconLookup = {
      shayr: {
        active: shayrActive,
        inactive: shayrInactive,
        user: shayrUser,
      },
      add: {
        active: addActive,
        inactive: addInactive,
        user: addUser,
      },
      done: {
        active: doneActive,
        inactive: doneInactive,
        user: doneUser,
      },
      like: {
        active: likeActive,
        inactive: likeInactive,
        user: likeUser,
      },
    };
    this.showCount = false;
    this.iconState = 'inactive';
  }

  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionCount: PropTypes.int.isRequired,
    actionUser: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (this.props.actionCount > 0) {
      this.iconState = 'active';
      this.showCount = true;
    }

    if (this.props.actionUser) {
      this.iconState = 'user';
    }
  }

  render() {
    if (!this.iconLookup.hasOwnProperty(this.props.actionType)) {
      return (
        <View style={styles.container}>
          <View style={styles.iconLoading}/>
        </View>
      );
    }

    const icon = this.iconLookup[this.props.actionType][this.iconState];
    const count = this.showCount ? this.props.actionCount : '';

    return (
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={icon}
        />
        <Text style={styles.count}>{count}</Text>
      </View>
    );
  }
}
