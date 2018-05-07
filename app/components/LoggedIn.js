import React, { Component } from 'react';
import { View } from 'react-native';

export default class LoggedIn extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: 'SIGNIN'
    }
  }
  componentDidMount() {
    this.props.navigation.navigate('App');
  }
  render() {
    return <View />
  }
}
