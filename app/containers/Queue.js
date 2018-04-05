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
import ActionButton from '../components/ActionButton';

export default class Queue extends Component {
  constructor() {
    super();
    this.state = {
      userId: 'testUser',
      loading: true,
      data: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: 'QUEUE'
    }
  }

  render() {
    console.log(this.state);
    console.log(this.props);
    return (
      <View style={styles.container}>
        <ActionButton
          action={() => this.props.navigation.navigate('Feed', this.state)}
        />
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
