import React, { Component } from "react";
import { View, Image } from "react-native";
import PropTypes from "prop-types";
import article from "../../assets/Article.png";
import styles from "./styles";

export default class PostImage extends Component {
  static propTypes = {
    view: PropTypes.oneOf(["list", "detail"]).isRequired,
    uri: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const imageStyle =
      this.props.view === "list" ? styles.imageList : styles.imageDetail;

    return (
      <View style={styles.container}>
        {this.props.uri ? (
          <Image style={imageStyle} source={{ uri: this.props.uri }} />
        ) : (
          <Image style={imageStyle} source={article} />
        )}
      </View>
    );
  }
}
