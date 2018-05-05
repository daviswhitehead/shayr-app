import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import LoggedIn from '../components/LoggedIn';
import LoggedOut from '../components/LoggedOut';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    // firebase.auth().signOut()
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user: user,
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    if (this.state.user) {
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
