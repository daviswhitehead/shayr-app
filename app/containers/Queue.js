import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import HamburgerMenu from '../components/HamburgerMenu';

export default class Queue extends Component {
  constructor() {
    super();
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    drawerLabel: 'QUEUE',
    title: 'QUEUE',
    headerLeft: (
      <HamburgerMenu
        nav={navigation}
      />
    )
  });

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../components/Article.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
