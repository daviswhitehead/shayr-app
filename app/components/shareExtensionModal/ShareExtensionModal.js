import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text
} from 'react-native';

export default class ShareExtensionModal extends Component {
  render() {
    return (
      <View>
        <Image
          source={require('./ShareExtensionTray.png')}
          style={styles.container}
          >
        </Image>
        <Text>Hello</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
