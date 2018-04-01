import React, { Component } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2C94C',
    height: 20,
  },
})
