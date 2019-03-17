import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import firebase from 'react-native-firebase';
import ShareExtension from 'react-native-share-extension';
import styles from './styles';
import shareExtensionLogo from '../../assets/ShareExtensionLogo.png';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { getFBAuthCredential, getCurrentUser } from '../../lib/FirebaseLogin';
import { createShare } from '../../lib/FirebaseHelpers';
import { buildAppLink } from '../../lib/DeepLinks';

const tapShareExtension = () => {
  const url = buildAppLink('shayr', 'shayr', 'Feed', {});
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.log(`Can't handle url: ${url}`);
        return false;
      }
      return Linking.openURL(url);
    })
    .catch(err => console.error('An error occurred', err));
};

export default class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: true,
      shareText: 'Shayring...',
    };
  }

  async componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState(previousState => ({
        ...previousState,
        user,
      }));
    });
    try {
      const token = await retrieveToken('accessToken');
      const credential = getFBAuthCredential(token);
      const currentUser = await getCurrentUser(credential);

      if (!currentUser) {
        throw new Error('unable to authenticate');
      }

      const ref = firebase
        .firestore()
        .collection('users')
        .doc(currentUser.user.uid);

      const { type, value } = await ShareExtension.data();

      const share = await createShare(ref, value);

      if (share) {
        setTimeout(() => {
          this.setState(previousState => ({
            ...previousState,
            shareText: 'Success!',
          }));
        }, 500);
      } else {
        setTimeout(() => {
          this.setState(previousState => ({
            ...previousState,
            shareText: 'Failed.',
          }));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  openModal() {
    this.setState(previousState => ({
      ...previousState,
      modalVisible: true,
    }));
  }

  closeModal() {
    this.setState(previousState => ({
      ...previousState,
      modalVisible: false,
    }));
    ShareExtension.close();
  }

  render() {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        onRequestClose={() => this.closeModal()}
        supportedOrientations={['portrait']}
        transparent
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.closeModal();
          }}
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={() => tapShareExtension()} style={styles.modal}>
              <Image source={shareExtensionLogo} style={styles.logo} />
              <Text style={styles.text}>{this.state.shareText}</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
