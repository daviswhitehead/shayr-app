import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
// import firebase from 'react-native-firebase';
// import {
//   createShare,
// } from '../functions/push';
import {
  retrieveAccessToken,
  // getAuthCredential,
  // getCurrentUser,
 } from '../functions/Auth';
 import ShareExtension from 'react-native-share-extension';

export default class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: true,
      loading: true,
      sharing: true,
      shareText: 'Shayring...'
    };
  }

  async componentDidMount() {
    // this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
    //   this.setState((previousState) => {
    //     return {
    //       ...previousState,
    //       loading: false,
    //       user: user,
    //     }
    //   })
    // });
    try {
      // authenticating
      let token = await retrieveAccessToken();

      // const credential = getAuthCredential(token);
      //
      // const currentUser = await getCurrentUser(credential);
      // if (!currentUser) {
      //   throw new Error('unable to authenticate');
      // }
      //
      // const ref = firebase.firestore().collection('users').doc(currentUser.user.uid);
      //
      // // sharing
      const { type, value } = await ShareExtension.data()

      // const share = await createShare(ref, value);

      if (true) {
      // if (share) {
        setTimeout(
          () => {this.setState((previousState) => {
              return {
                ...previousState,
                shareText: token,
              }
            });
          },
          1000
        );
      }
      else {
        setTimeout(
          () => {this.setState((previousState) => {
              return {
                ...previousState,
                shareText: 'Failed.',
              }
            });
          },
          3000
        );
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    // this.authSubscription();
  }

  openModal() {
    this.setState((previousState) => {
      return {
        ...previousState,
        modalVisible: true,
      }
    });
  }

  closeModal() {
    this.setState((previousState) => {
      return {
        ...previousState,
        modalVisible: false,
      }
    });
    ShareExtension.close()
  }

  render() {
    console.log(this.state);
    return (
        <Modal
            visible={this.state.modalVisible}
            animationType={'slide'}
            onRequestClose={() => this.closeModal()}
            transparent={true}
        >
          <TouchableWithoutFeedback
            onPress={() => {this.closeModal()}}
          >
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.modal}
              >
                <Image
                  source={require('../components/ShareExtensionLogo.png')}
                  style={styles.logo}
                  >
                </Image>
                <Text style={styles.text}>
                  {this.state.shareText}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#F2C94C',
    height: 60,
    width: 60*4,
    marginBottom: 100,
    borderRadius: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    height: 60,
    width: 60,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
  },
});
