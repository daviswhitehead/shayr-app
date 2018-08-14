import React, { Component } from 'react';
import {
    View,
    Button,
    Image,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { registerAppListener } from "../../components/Listener";
import { LoginButton } from 'react-native-fbsdk';
import { AsyncStorage } from 'react-native';
import {
  authSubscription,
  signOutUser,
  locateAccessToken,
  facebookAuthTap,
  facebookAuth,
  signedIn
} from '../../redux/authentication/AuthenticationActions';
import styles from './styles';
import vectorLogo from '../../assets/VectorLogo.png';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authSubscription: () => dispatch(authSubscription()),
    signOutUser: () => dispatch(signOutUser()),
    locateAccessToken: () => dispatch(locateAccessToken()),
    facebookAuthTap: () => dispatch(facebookAuthTap()),
    facebookAuth: (error, result) => dispatch(facebookAuth(error, result)),
    signedIn: () => dispatch(signedIn()),
  }
}

class Login extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.authSubscription()
    this.props.locateAccessToken()
    // Build a channel
    const channel = new firebase.notifications.Android.Channel('new-shayr-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);
    registerAppListener(this.props.navigation);
    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // Get information about the notification that was opened
          const notif = notificationOpen.notification;
          this.setState({
            initNotif: notif.data
          })
          if (notif && notif.targetScreen === 'detail') {
            setTimeout(() => {
              this.props.navigation.navigate('Detail')
            }, 500)
          }
        }
      });
    const offline = AsyncStorage.getItem('headless')
    if (offline) {
      this.setState({
        offlineNotif: offline
      });
      AsyncStorage.removeItem('headless');
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.props.auth.error) {
      console.error('authentication error');
    }

    if (this.props.auth.user && this.props.auth.accessTokenSaved) {
      // kicking off this navigation within render is causing an error
      this.props.signedIn()
    }

    return (
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Image
            style={styles.image}
            source={vectorLogo}
          />
          <Text style={styles.brand}>shayr</Text>
          <Text style={styles.tagline}>discover together</Text>
        </View>
        <View style={styles.loginContainer}>
          <TouchableWithoutFeedback
            onPress={this.props.facebookAuthTap}
          >
            <LoginButton
              readPermissions={['public_profile', 'email']}
              onLoginFinished={(error, result) => this.props.facebookAuth(error, result)}
              onLogoutFinished={() => console.log('user logout')}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
