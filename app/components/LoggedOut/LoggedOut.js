import React, { Component } from 'react';
import {
    View,
    Button,
    Image,
    Text,
    StyleSheet,
} from 'react-native';

import styles from './styles';
import vectorLogo from '../../assets/VectorLogo.png';
import {
  getFBToken,
  getAuthCredential,
  getCurrentUser,
  storeAccessToken,
 } from '../../functions/Auth';
import {
  saveUserInfo,
} from '../../functions/push';

import { LoginButton } from 'react-native-fbsdk';

export default class LoggedOut extends React.Component {
  async facebookLogin(error, result) {
    try {
      const tokenData = await getFBToken(error, result);

      storeAccessToken(tokenData.accessToken);

      const credential = getAuthCredential(tokenData.accessToken);

      const currentUser = await getCurrentUser(credential);

      await saveUserInfo(currentUser.user, currentUser.additionalUserInfo.profile);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
      return (
          <View
            style={styles.container}
          >
            <View
              style={styles.brandContainer}
            >
              <Image
                style={styles.image}
                source={vectorLogo}
              />
              <Text style={styles.brand}>shayr</Text>
              <Text style={styles.tagline}>discover together</Text>
            </View>
            <View
              style={styles.loginContainer}
            >
              <LoginButton
                readPermissions={['public_profile', 'email']}
                onLoginFinished={(error, result) => this.facebookLogin(error, result)}
                onLogoutFinished={() => console.log('user logout')}
              />
            </View>
          </View>
      );
  }
}
