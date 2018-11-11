import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Feed from "../../containers/Feed";

import { loadFriendships } from "../../redux/social/SocialActions";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadFriendships: userId => dispatch(loadFriendships(userId))
    // loadFriends: userId => dispatch(loadFriends(userId))
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
    this.unsubscribeFriendships = this.props.loadFriendships(
      this.props.auth.user.uid
    );
  }

  componentWillUnmount() {
    this.unsubscribeFriendships();
  }

  render() {
    return <Feed />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginListener);
