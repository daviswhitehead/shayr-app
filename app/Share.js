import React, { Component } from 'react'
import ShareExtension from 'react-native-share-extension'
// import firebase from 'react-native-firebase'

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

export default class Share extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isOpen: true,
      type: '',
      value: ''
    }
    // this.posts = firebase.firestore().collection('posts');
    // console.log(this.posts);
    // console.log(this.posts.orderBy('created_at').limit(1).get());
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
    } catch(e) {
      console.log('errrr', e)
    }
  }

  onClose() {
    ShareExtension.close()
  }

  closing = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.widthContainer}>
              <TouchableOpacity
                style={styles.box}
                onPress={this.onClose}
              >

              </TouchableOpacity>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  widthContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'purple',
  },
})
