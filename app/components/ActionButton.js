import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

export default class ActionButton extends Component {
  constructor() {
    super();
  }

  render() {
    const { action } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.button}
        onPress={() => action()}
      >
        <Image
          style={styles.image}
          source={require('./VectorLogo.png')}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 24,
    bottom: 24,
    backgroundColor: '#F2C94C',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5
   },
  image: {
    resizeMode: 'contain',
    width: 36,
    height: 36,
  },
});
