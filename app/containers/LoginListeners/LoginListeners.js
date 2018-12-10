import React, { Component } from "react";
import { connect } from "react-redux";
import Feed from "../../containers/Feed";
import PostDetails from "../../containers/PostDetails";
import HeaderBar from "../../components/HeaderBar";
import { colors } from "../../styles/Colors";

import { loadSelf, loadFriendships } from "../../redux/social/SocialActions";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadFriendships: userId => dispatch(loadFriendships(userId)),
    loadSelf: userId => dispatch(loadSelf(userId))
  };
};

class LoginListener extends Component {
  // Set up all post-login listeners that should persist across screens
  // Navigate to the landing screen
  constructor() {
    super();
    this.subscriptions = [];
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderBar
          backgroundColor={colors.YELLOW}
          statusBarStyle="dark-content"
          shadow
          title="feed"
        />
      )
    };
  };

  componentDidMount() {
    this.subscriptions.push(
      this.props.loadSelf(this.props.auth.user.uid),
      this.props.loadFriendships(this.props.auth.user.uid)
    );
  }

  componentWillUnmount() {
    for (var subscription in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(subscription)) {
        this.subscriptions[subscription]();
      }
    }
  }

  render() {
    // return <Feed />;
    return <PostDetails />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginListener);
