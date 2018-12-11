import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export default class PostContext extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
    actions: PropTypes.any
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textBox}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.publisher}>{this.props.publisher}</Text>
        </View>
        {this.props.actions ? (
          <View style={styles.actionsBox}>{this.props.actions}</View>
        ) : (
          <View style={styles.actionsBox} />
        )}
      </View>
    );
  }
}
