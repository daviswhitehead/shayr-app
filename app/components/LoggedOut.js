import React, { Component } from 'react';
import { LoginButton } from 'react-native-fbsdk';
import {
    View,
    Button,
    Image,
    Text,
    StyleSheet,
} from 'react-native';
import {
  getFBToken,
  getAuthCredential,
  getCurrentUser,
  storeAccessToken,
 } from '../functions/Auth';
import {
  saveUserInfo,
} from '../functions/push';

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
      console.log(this.state);
      console.log(this.props);
      return (
          <View
            style={styles.container}
          >
            <View
              style={styles.brandContainer}
            >
              <Image
                style={styles.image}
                source={require('./VectorLogo.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2C94C'
  },
  brandContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 128,
    height: 128,
  },
  brand: {
    fontWeight: '900',
    fontSize: 60,
    paddingTop: 20,
  },
  tagline: {
    fontWeight: '100',
    fontSize: 25
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
