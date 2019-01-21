import React, { Component } from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LoginButton } from "react-native-fbsdk";
import {
  authSubscription,
  signOutUser,
  locateAccessToken,
  facebookAuthTap,
  facebookAuth,
  signedIn
} from "./actions";
import styles from "./styles";
import vectorLogo from "../../assets/VectorLogo.png";

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authSubscription: () => dispatch(authSubscription()),
    signOutUser: () => dispatch(signOutUser()),
    locateAccessToken: () => dispatch(locateAccessToken()),
    facebookAuthTap: () => dispatch(facebookAuthTap()),
    facebookAuth: (error, result) => dispatch(facebookAuth(error, result)),
    signedIn: () => dispatch(signedIn())
  };
};

class Login extends Component {
  componentDidMount() {
    // check authentication
    this.unsubscribe = this.props.authSubscription();
    this.props.locateAccessToken();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.props.auth.error) {
      console.error("authentication error");
    }

    if (this.props.auth.user && this.props.auth.accessTokenSaved) {
      // kicking off this navigation within render is causing an error
      this.props.signedIn();
    }

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
              readPermissions={["public_profile", "email"]}
              onLoginFinished={(error, result) =>
                this.props.facebookAuth(error, result)
              }
              onLogoutFinished={() => console.log("user logout")}
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
