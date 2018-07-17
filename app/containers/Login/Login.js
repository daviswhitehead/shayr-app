import React, { Component } from 'react';
import {
    View,
    Button,
    Image,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { LoginButton } from 'react-native-fbsdk';
import { retrieveAccessToken } from '../../lib/Authentication';
import {
  authSubscription,
  signOutUser,
  locateAccessToken,
  facebookTokenRequest,
  facebookTokenSuccess
} from '../../redux/actions/Authentication';
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
    facebookTokenRequest: () => dispatch(facebookTokenRequest()),
    facebookTokenSuccess: () => dispatch(facebookTokenSuccess()),
  }
}

class Login extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.authSubscription()
    this.props.locateAccessToken()
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    console.log(this.state);
    console.log(this.props);
    if (this.props.auth.user && this.props.auth.accessTokenStored) {
      console.log('logged in');
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
            onPress={this.props.facebookTokenRequest}
          >
            <LoginButton
              readPermissions={['public_profile', 'email']}
              onLoginFinished={this.props.facebookTokenSuccess}
              onLogoutFinished={() => console.log('user logout')}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
