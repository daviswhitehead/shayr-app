import React, { Component } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
} from 'react-native';

import styles from './styles';

export default class ShayrStatusBar extends Component {
  render() {
    return (
      <StatusBar style={styles.container}
        barStyle='dark-content'
      />
    )
  }
}
// may want to add translucent=true for android
