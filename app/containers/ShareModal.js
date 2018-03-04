import React, { Component } from 'react';
import { Text, View, Button, Modal, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

const getPost = (ref, url) => {
  return ref
    .where('url', '==', url).get()
    .then((query) => {
      // if there's a single matching post
      if (query.size === 1) {
        console.log('Document found!');
        return query.docs[0];
      }
      console.log('No matching post or too many matching posts');
      return false
    })
    .catch((error) => {
      console.error(error);
      return false
    });
}

const createGetPost = (ref, url) => {
  const ts = firebase.firestore.FieldValue.serverTimestamp();
  return ref
    .add({
      createdAt: ts,
      updatedAt: ts,
      url: url
    })
    .then((ref) => {
      console.log("Document successfully written!");
      return ref.get()
    })
    .catch((error) => {
      console.error(error);
      return false
    });
}

export default class MyComponent extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('posts');
    this.unsubscribe = null;
    this.state = {
      modalVisible: true,
    };
  }

  async componentDidMount() {
    try {
      // const { type, value } = await ShareExtension.data()
      // this.setState({
      //   type,
      //   value
      // })
      // this.url = 'https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html';
      this.url = 'https://motherboard.vice.com/en_us/article/a34g9j/iphone-source-code-iboot-ios-leak';
      this.post = await getPost(this.ref, this.url);
      if (!this.post) {
        this.post = await createGetPost(this.ref, this.url);
      }
      if (this.post) {
        this.unsubscribe = this.post.ref.onSnapshot(this.onPostUpdate);
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    if (this.post) {
      this.unsubscribe();
    }
  }

  onPostUpdate = (snapshot) => {
    this.post = snapshot;
    // manage url vs loading vs post states
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  render() {
    return (
        <View style={styles.container}>
          <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>
                <Text>HELLO JOSHUA</Text>
                <Button
                    onPress={() => this.closeModal()}
                    title="Close modal"
                >
                </Button>
              </View>
            </View>
          </Modal>
          <Button
              onPress={() => this.openModal()}
              title="Open modal"
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#989898',
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '95%',
    height: '40%',
    top: 100,
  },
});
