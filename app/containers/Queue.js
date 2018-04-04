import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';
import List from '../components/List';
import {
  getUserSavedPosts,
  getPost,
  getPostShares,
} from '../functions/pull';
import {
  savePostToUser,
} from '../functions/push'
import Icon from 'react-native-vector-icons/MaterialIcons';
import HamburgerMenu from '../components/HamburgerMenu';

export default class Queue extends Component {
  constructor() {
    super();
    this.state = {
      userId: 'testUser',
      loading: true,
      data: []
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    drawerLabel: 'QUEUE',
    title: 'QUEUE',
    headerLeft: (
      <HamburgerMenu
        navigation={navigation}
      />
    )
  });

  render() {
    console.log(this.state);
    console.log(this.props);
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
