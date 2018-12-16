import React, { Component } from "react";
import { View, Image } from "react-native";
import PropTypes from "prop-types";
import article from "../../assets/Article.png";
import StyleSheetFactory from "./styles";

export default class PostFeaturedUser extends Component {
  static propTypes = {
    view: PropTypes.oneOf(["list", "detail"]).isRequired,
    uri: PropTypes.string
  };

  static defaultProps = {};

  // selectFeature = () => {
  //   let featuredUserId = '';
  //   let featuredType = '';

  //   if (this.props.shares) {
  //     featuredUserId = this.props.shares[0];
  //     featuredType = 'shayred';
  //   } else if (this.props.adds) {
  //     featuredUserId = this.props.adds[0];
  //     featuredType = 'added';
  //   } else if (this.props.dones) {
  //     featuredUserId = this.props.dones[0];
  //     featuredType = 'checked';
  //   } else if (this.props.likes) {
  //     featuredUserId = this.props.likes[0];
  //     featuredType = 'liked';
  //   }

  //   if (featuredUserId && featuredType) {
  //     data['facebookProfilePhoto'] = _.get(
  //       this.props.friends,
  //       [featuredUserId, 'facebookProfilePhoto'],
  //       'missing'
  //     );
  //     data['firstName'] = _.get(this.props.friends, [featuredUserId, 'firstName'], 'missing');
  //     data['lastName'] = _.get(this.props.friends, [featuredUserId, 'lastName'], 'missing');
  //     data['featureType'] = featuredType;
  //   }
  // };

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
