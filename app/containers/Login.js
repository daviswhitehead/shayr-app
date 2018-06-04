import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import LoggedIn from '../components/LoggedIn';
import LoggedOut from '../components/LoggedOut';
import { retrieveAccessToken } from '../functions/Auth';

export default class LoginScreen extends React.Component {
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
      return (
        <LoggedIn
          navigation={this.props.navigation}
          user={this.props.user}
        />
      );
    }
    return (
      <LoggedOut navigation={this.props.navigation}/>
    );
  }
}
