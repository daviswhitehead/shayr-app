import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import vectorLogo from '../../assets/images/VectorLogo.png';
import {
  facebookAuth,
  facebookAuthTap,
  signOutUser
} from '../../redux/auth/actions';
import styles from './styles';

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  facebookAuthTap: () => dispatch(facebookAuthTap()),
  facebookAuth: (error, result) => dispatch(facebookAuth(error, result)),
  signOutUser: () => dispatch(signOutUser())
});

class Login extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    facebookAuthTap: PropTypes.func.isRequired,
    facebookAuth: PropTypes.func.isRequired,
    signOutUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    if (this.props.auth.isSigningOut) {
      // when a user navigates to the login screen with isSigningOut === true, sign out the user
      this.props.signOutUser();
    } else if (this.props.auth.user.uid && this.props.auth.hasAccessToken) {
      // when a user navigates to the login screen already authenticated (app launch), navigate to the app
      this.props.navigation.navigate('App');
    }
  }

  componentDidUpdate() {
    if (this.props.auth.user.uid && this.props.auth.hasAccessToken) {
      // navigate to the app after successful authentication
      this.props.navigation.navigate('App');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Image style={styles.image} source={vectorLogo} />
          <Text style={styles.brand}>shayr</Text>
          <Text style={styles.tagline}>discover together</Text>
        </View>
        <View style={styles.loginContainer}>
          <TouchableWithoutFeedback onPress={this.props.facebookAuthTap}>
            <LoginButton
              readPermissions={['public_profile', 'email']}
              onLoginFinished={(error, result) =>
                this.props.facebookAuth(error, result)
              }
              onLogoutFinished={() => this.props.signOutUser()}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
