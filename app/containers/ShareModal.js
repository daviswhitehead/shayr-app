import React, { Component } from 'react';
import { Text, View, Button, Modal, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import ShareExtensionModal from '../components/shareExtensionModal/ShareExtensionModal';

const createShare = (ref, url) => {
  const ts = firebase.firestore.FieldValue.serverTimestamp();
  return ref.doc("testUser").collection('shares')
    .add({
      createdAt: ts,
      updatedAt: ts,
      url: url
    })
    .then((ref) => {
      console.log("Document successfully written!");
      return ref
    })
    .catch((error) => {
      console.error(error);
      return false
    });
}

export default class MyComponent extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      modalVisible: true,
      shareSucces: false,
      default: 'Sharing...'
    };
    setInterval(() => {
      this.setState(previousState => {
        return { shareSucces: !previousState.shareSucces };
      });
    }, 3000);
  }

  async componentDidMount() {
    console.log('hello');
    try {
      // const { type, value } = await ShareExtension.data()
      // this.setState({
      //   type,
      //   value
      // })
      // this.url = 'https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html';
      // this.url = 'https://motherboard.vice.com/en_us/article/a34g9j/iphone-source-code-iboot-ios-leak';
      // this.url = 'https://www.washingtonpost.com/news/business/wp/2018/03/02/feature/the-silicon-valley-elites-latest-status-symbol-chickens/?utm_term=.cb69512f5b5b';
      // this.share = await createShare(this.ref, this.url);
      const test = 'hello';
    }
    catch(error) {
      console.log(error);
    }
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  render() {
    // let display = this.state.shareSucces ? 'Success' : '...Sharing'; // try again
    let display = ''
    return (
        <View style={styles.container}>
          <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>
                <Text>{display}</Text>
                <ShareExtensionModal/>
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
