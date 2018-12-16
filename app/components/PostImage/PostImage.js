import React, { Component } from "react";
import { View, Image } from "react-native";
import PropTypes from "prop-types";
import article from "../../assets/Article.png";
import StyleSheetFactory from "./styles";

export default class PostImage extends Component {
  static propTypes = {
    view: PropTypes.oneOf(["list", "detail"]).isRequired,
    uri: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const styles = StyleSheetFactory.getSheet(this.props.view);

    return (
      <View style={styles.container}>
        {this.props.uri ? (
          <Image style={styles.image} source={{ uri: this.props.uri }} />
        ) : (
          <Image style={styles.image} source={article} />
        )}
      </View>
    );
  }
}
