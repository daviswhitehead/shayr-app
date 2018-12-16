import React, { Component } from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import StyleSheetFactory from "./styles";

export default class PostTitle extends Component {
  static propTypes = {
    view: PropTypes.oneOf(["list", "detail"]).isRequired,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {};

  render() {
    const styles = StyleSheetFactory.getSheet(this.props.view);

    return <Text style={styles.title}>{this.props.title}</Text>;
  }
}
