import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class FontSubHeading extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    styles: PropTypes.object,
  };

  static defaultProps = {
    styles: {},
  };

  render() {
    const text = this.props.text.length > 16 ? `${this.props.text.substring(0, 16)}...` : this.props.text;
    return (
      <View style={styles.box}>
        <Text style={{ ...styles.text, ...this.props.styles }}>{text}</Text>
      </View>
    );
  }
}
