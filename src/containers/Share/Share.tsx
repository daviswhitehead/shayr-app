import { buildAppLink } from '@daviswhitehead/shayr-resources';
import React, { Component } from 'react';
import {
  Image,
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import firebase from 'react-native-firebase';
import ShareExtension from 'react-native-share-extension';
import { connect } from 'react-redux';
import shareExtensionLogo from '../../assets/ShareExtensionLogo.png';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { userAnalytics } from '../../lib/FirebaseAnalytics';
import { createShare } from '../../lib/FirebaseHelpers';
import { getCurrentUser, getFBAuthCredential } from '../../lib/FirebaseLogin';
import styles from './styles';

const tapShareExtension = async () => {
  const url = buildAppLink('shayr', 'shayr', 'Discover', {});
  try {
    (await Platform.OS) === 'ios'
      ? ShareExtension.openURL(url)
      : Linking.openURL(url);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      shareText: 'Shayring...'
    };
    firebase.analytics().logEvent('SHARE_EXTENSION_LAUNCH');
  }

  async componentDidMount() {
    firebase.analytics().setCurrentScreen('Share');
    this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      this.setState(previousState => ({
        ...previousState,
        user
      }));
    });

    try {
      const token = await retrieveToken('accessToken');
      const credential = getFBAuthCredential(token);
      const currentUser = await getCurrentUser(credential);

      if (!currentUser) {
        throw new Error('unable to authenticate');
      }

      userAnalytics(currentUser.user.uid);

      const ref = firebase
        .firestore()
        .collection('users')
        .doc(currentUser.user.uid);

      const { type, value } = await ShareExtension.data();

      const share = await createShare(ref, value);

      if (share) {
        firebase.analytics().logEvent('SHARE_EXTENSION_SUCCESS', {
          share: value.substring(0, 99)
        });
        setTimeout(() => {
          this.setState(previousState => ({
            ...previousState,
            shareText: 'Success!'
          }));
        }, 500);
      } else {
        firebase.analytics().logEvent('SHARE_EXTENSION_FAIL');
        setTimeout(() => {
          this.setState(previousState => ({
            ...previousState,
            shareText: 'Failed.'
          }));
        }, 1000);
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
      modalVisible: true
    }));
  }

  closeModal() {
    this.setState(previousState => ({
      ...previousState,
      modalVisible: false
    }));
    ShareExtension.close();
  }

  render() {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType='slide'
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
            <TouchableOpacity
              onPress={() => tapShareExtension()}
              style={styles.modal}
            >
              <Image source={shareExtensionLogo} style={styles.logo} />
              <Text style={styles.text}>{this.state.shareText}</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);
