import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import PropTypes from "prop-types";
import StyleSheetFactory from "./styles";
import colors from "../../styles/Colors";

export default class ProfileIcon extends Component {
  static propTypes = {
    view: PropTypes.oneOf(["small", "large"]).isRequired,
    uri: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired
  };

  static defaultProps = {};

  render() {
    let styles = StyleSheetFactory.getSheet(this.props.view);
    let name =
      this.props.view === "small"
        ? `${this.props.firstName} ${this.props.lastName}`
        : `${this.props.firstName} ${this.props.lastName.charAt(0)}.`;

    return (
      <View style={styles.container}>
        <View style={styles.imageBox}>
          {this.props.uri ? (
            <Image style={styles.image} source={{ uri: this.props.uri }} />
          ) : (
            <View
              style={{
                ...styles.image,
                backgroundColor: colors.LIGHT_GRAY
              }}
            />
          )}
        </View>
        <View style={styles.nameBox}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    );
  }
}
