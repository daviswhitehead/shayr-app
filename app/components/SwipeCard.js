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
    const {payload, swipeLeftToRightUI, swipeLeftToRightAction} = this.props;
    return (
      <Swipeable
        leftActionActivationDistance={100}
        leftContent={swipeLeftToRightUI()}
        onLeftActionRelease={() => swipeLeftToRightAction(payload)}
      >
        <ContentCard payload={payload} />
      </Swipeable>
    );
  }
}
