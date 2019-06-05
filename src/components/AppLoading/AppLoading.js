import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';

class AppLoading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
}

export default AppLoading;
