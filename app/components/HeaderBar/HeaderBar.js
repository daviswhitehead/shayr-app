import React, { Component } from "react";
import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import styles from "./styles";
import ShayrStatusBar from "../ShayrStatusBar/ShayrStatusBar";
import { createShadow } from "../../styles/Shadows";

export default class HeaderBar extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    statusBarStyle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shadow: PropTypes.bool,
    back: PropTypes.func
  };

  render() {
    const shadowStyle = this.props.shadow ? createShadow(5) : {};

    return (
      <View
        style={{
          ...styles.container,
          ...shadowStyle,
          backgroundColor: this.props.backgroundColor
        }}
      >
        <ShayrStatusBar
          translucent
          barStyle={this.props.statusBarStyle}
          backgroundColor={this.props.backgroundColor}
        />
        <SafeAreaView>
          <View
            style={{
              ...styles.header,
              backgroundColor: this.props.backgroundColor
            }}
          >
            <View style={styles.headerBox}>
              <View style={styles.bookendsBox}>
                {this.props.back ? (
                  <TouchableOpacity onPress={() => this.props.back()}>
                    <Icon name="chevron-left" size={24} color="black" />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              <View style={styles.bookendsBox} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
