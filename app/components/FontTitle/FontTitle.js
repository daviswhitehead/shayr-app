import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export default class FontTitle extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    styles: PropTypes.object
  };

  static defaultProps = {
    styles: {}
  };

  render() {
    return (
      <View style={styles.box}>
        <Text style={{ ...styles.text, ...this.props.styles }}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}
