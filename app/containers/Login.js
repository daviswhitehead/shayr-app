import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import LoggedOut from '../components/LoggedOut';
import { retrieveAccessToken } from '../functions/Auth';
import { authenticationActionTypes, authenticationActions } from '../redux/Actions';

const mapStateToProps = (state) => {
 return { };
}
const mapDispatchToProps = (dispatch) => ({
  SIGN_IN: () => dispatch({ type: authenticationActionTypes.SIGN_IN }),
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasToken: false,
    };
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          user: user,
        }
      });
    });
    const token = retrieveAccessToken();
    if (token) {
      this.setState((previousState) => {
        return {
          ...previousState,
          hasToken: true,
        }
      });
    }
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    if (this.state.user && this.state.hasToken) {
      // this.props.login()
      this.props.SIGN_IN()
    }
    return (
      <LoggedOut navigation={this.props.navigation}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
