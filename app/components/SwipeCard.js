import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import ContentCard from './ContentCard';


export default class SwipeCard extends Component {
  constructor() {
    super();
  }

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
        <ContentCard payload={payload} />
      </Swipeable>
    );
  }
}
