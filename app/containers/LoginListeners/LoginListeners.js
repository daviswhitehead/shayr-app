import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Feed from "../../containers/Feed";

import { loadFriends } from "../../redux/social/SocialActions";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadFriends: userId => dispatch(loadFriends(userId))
  };
};

class LoginListener extends Component {
  // Set up all post-login listeners that should persist across screens
  // Navigate to the landing screen
  static propTypes = {};

  static navigationOptions = {
    title: "feed"
  };

  componentDidMount() {
    this.unsubscribeFriends = this.props.loadFriends(this.props.auth.user.uid);
  }

  componentWillUnmount() {
    this.unsubscribeFriends();
  }

  render() {
    return <Feed />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginListener);
