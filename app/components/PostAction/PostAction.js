import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import icoMoonConfig from "../../assets/fonts/selection.json";
import styles from "./styles";
import { colors } from "../../styles/Colors";
import { fonts } from "../../styles/Fonts";
const PostActionIcons = createIconSetFromIcoMoon(icoMoonConfig);

export default class PostAction extends Component {
  constructor() {
    super();
    this.state = {
      wasPressed: false,
      user: false,
      count: 0
    };
  }

  static propTypes = {
    actionType: PropTypes.oneOf(["share", "add", "done", "like"]).isRequired,
    actionCount: PropTypes.number,
    actionUser: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired
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

  onPress = onPress => {
    // state takes over the logic after the action has been pressed to feel real-time
    const decider = this.state.wasPressed
      ? this.state.user
      : this.props.actionUser;
    const counter = this.state.wasPressed
      ? this.state.count
      : this.props.actionCount;

    this.setState(previousState => ({
      wasPressed: true,
      user: previousState.wasPressed
        ? !previousState.user
        : !this.props.actionUser,
      count: decider === false ? counter + 1 : counter - 1
    }));

    onPress();
  };

  render() {
    let count = this.state.wasPressed
      ? this.state.count
      : this.props.actionCount;

    const [iconColor, countColor, countFont] = this.getIconState(
      count,
      this.state.wasPressed ? this.state.user : this.props.actionUser
    );

    let countStyles = {
      fontFamily: countFont
    };
    if (countColor) {
      countStyles["color"] = countColor;
    }

    return (
      <TouchableOpacity onPress={() => this.onPress(this.props.onPress)}>
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
