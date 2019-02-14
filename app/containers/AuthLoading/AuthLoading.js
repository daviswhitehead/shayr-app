import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../Login/styles';

class AuthLoading extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    const auth = true;
    const { navigation } = this.props;
    navigation.navigate(auth ? 'App' : 'Auth');
  }

  // Render any loading content that you like here
  render() {
    return (
      // <View>
      <View style={styles.container}>
        <Text>Hello World</Text>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
}

export default AuthLoading;
