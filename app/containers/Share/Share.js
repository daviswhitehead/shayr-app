import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import styles from './styles';
import shareExtensionLogo from '../../assets/ShareExtensionLogo.png';
import {
  retrieveAccessToken,
  getAuthCredential,
  getCurrentUser,
  createShare,
} from '../../redux/authentication/AuthenticationActions';

 import firebase from 'react-native-firebase';
 import ShareExtension from 'react-native-share-extension';

export default class MyComponent extends Component {
  constructor() {
    super();
    console.log('JAVASCRIPT LOADED');
    this.state = {
      modalVisible: true,
      loading: true,
      sharing: true,
      shareText: 'Shayring...'
    };
  }

  async componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          user: user,
        }
      })
    });
    try {
      let token = await retrieveAccessToken();
      console.log('TOKEN LOADED');

      const credential = getAuthCredential(token);
      console.log('CREDENTIAL LOADED');

      const currentUser = await getCurrentUser(credential);
      console.log('CURRENTUSER LOADED');
      if (!currentUser) {
        throw new Error('unable to authenticate');
      }

      const ref = firebase.firestore().collection('users').doc(currentUser.user.uid);
      console.log('REF LOADED');

      const { type, value } = await ShareExtension.data()
      console.log('DATA LOADED');

      const share = await createShare(ref, value);

      if (share) {
        setTimeout(
          () => {this.setState((previousState) => {
              return {
                ...previousState,
                shareText: 'Success!',
              }
            });
          },
          500
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
    this.authSubscription();
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
                  source={shareExtensionLogo}
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
