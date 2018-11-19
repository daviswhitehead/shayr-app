import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

// import ContentCard from '../ContentCard';

import Swipeable from 'react-native-swipeable';


export default class SwipeCard extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    payload: PropTypes.object.isRequired,
    swipeLeftToRightUI: PropTypes.func,
    swipeLeftToRightAction: PropTypes.func,
    swipeRightToLeftUI: PropTypes.func,
    swipeRightToLeftAction: PropTypes.func,
  };

  render() {
    const {
      payload, swipeLeftToRightUI, swipeLeftToRightAction, swipeRightToLeftUI,
      swipeRightToLeftAction
    } = this.props;
    let swipeableOptions = {};

    if (swipeLeftToRightUI && swipeLeftToRightAction) {
      swipeableOptions = {
        ...swipeableOptions,
        leftActionActivationDistance: 100,
        leftContent: swipeLeftToRightUI(),
        onLeftActionRelease: () => swipeLeftToRightAction(payload),
      }
    }

    if (swipeRightToLeftUI && swipeRightToLeftAction) {
      swipeableOptions = {
        ...swipeableOptions,
        rightActionActivationDistance: 100,
        rightContent: swipeRightToLeftUI(),
        onRightActionRelease: () => swipeRightToLeftAction(payload),
      }
    }

    return (
      <Swipeable
        {...swipeableOptions}
      >
        {this.props.card}
      </Swipeable>
    );
  }
}
