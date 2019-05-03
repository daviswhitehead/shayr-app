import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const FontBody = ({ text, style }) => (
  <View style={styles.box}>
    <Text style={{ ...styles.text, ...style }}>{text}</Text>
  </View>
);

FontBody.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

FontBody.defaultProps = {
  style: {},
};

export default FontBody;
