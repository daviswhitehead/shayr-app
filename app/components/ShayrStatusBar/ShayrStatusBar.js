import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export default class ShayrStatusBar extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    translucent: PropTypes.bool,
    hidden: PropTypes.bool,
    barStyle: PropTypes.string.isRequired
  };

  render() {
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: this.props.backgroundColor
        }}
      >
        <StatusBar {...this.props} />
      </View>
    );
  }
}
