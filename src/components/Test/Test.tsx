import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

export class Test extends Component {
  static propTypes = {
    prop: PropTypes
  };

  heavy = () => {
    for (let index = 0; index < 100000000000; index += 1) {
      const z = Math.sqrt(index);
    }
  };

  render() {
    return (
      <View>
        <Text> prop </Text>
        <Button title='test' onPress={this.heavy} />
      </View>
    );
  }
}

export default Test;
