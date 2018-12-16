import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export default class PostActionsBox extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.element).isRequired
  };

  static defaultProps = {};

  render() {
    return <View style={styles.box}>{this.props.actions}</View>;
  }
}
