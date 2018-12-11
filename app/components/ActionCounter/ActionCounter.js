import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import icoMoonConfig from "../../assets/fonts/selection.json";
import styles from "./styles";
import { colors } from "../../styles/Colors";
import { fonts } from "../../styles/Fonts";
const PostActionIcons = createIconSetFromIcoMoon(icoMoonConfig);

export default class ActionCounter extends Component {
  static propTypes = {
    actionType: PropTypes.oneOf(["share", "add", "done", "like"]).isRequired,
    actionCount: PropTypes.number,
    actionUser: PropTypes.bool.isRequired,
    onTap: PropTypes.func.isRequired
  };

  getIconState = (count, user) => {
    let iconColor = colors.LIGHT_GRAY;
    let countColor = false;
    let countFont = fonts.LIGHT.fontFamily;

    if (count > 0) {
      iconColor = colors.BLACK;
      countColor = colors.DARK_GRAY;
    }

    if (user) {
      iconColor = colors.YELLOW;
      countColor = colors.YELLOW;
      countFont = fonts.BOLD.fontFamily;
    }

    return [iconColor, countColor, countFont];
  };

  render() {
    const [iconColor, countColor, countFont] = this.getIconState(
      this.props.actionCount,
      this.props.actionUser
    );

    let count = "";
    let countStyles = {
      fontFamily: countFont
    };
    if (countColor) {
      count = this.props.actionCount;
      countStyles["color"] = countColor;
    }

    return (
      <TouchableOpacity onPress={() => this.props.onTap()}>
        <View style={styles.container}>
          <View style={styles.iconBox}>
            <PostActionIcons
              name={this.props.actionType}
              size={16}
              color={iconColor}
            />
          </View>
          <View style={styles.countBox}>
            <Text style={{ ...styles.count, ...countStyles }}>{count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
