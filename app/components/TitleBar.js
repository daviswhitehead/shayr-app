import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import HamburgerMenu from '../components/hamburgerMenu/HamburgerMenu'

export default class TitleBar extends Component {

  render() {
    const {children} = this.props

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.hamburgerHelper}>
            <HamburgerMenu/>
          </View>
          <Text style={styles.text}>{children}</Text>
          <View style={styles.hamburgerHelper}>
          </View>
        </View>
     </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2C94C',
    height: 55,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 20,
  },
  hamburgerHelper: {
    height: 10,
    width: 20,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
})
