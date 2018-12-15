import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export default class HeaderTitle extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render() {
    return (
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>{this.props.title}</Text>
      </View>
    );
  }
}
