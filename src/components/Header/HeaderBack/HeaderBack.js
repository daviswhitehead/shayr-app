import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class HeaderBack extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()}>
        <Icon name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
    );
  }
}
