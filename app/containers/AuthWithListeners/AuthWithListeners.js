import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  subscribeToSelf,
  subscribeToFriendships,
  subscribeNotificationTokenRefresh,
} from './actions';
import AppLoading from '../../components/AppLoading';
import Feed from '../Feed';

const mapStateToProps = state => ({
  appListeners: state.appListeners,
});

const mapDispatchToProps = dispatch => ({
  subscribeToSelf: userId => dispatch(subscribeToSelf(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
  subscribeNotificationTokenRefresh: userId => dispatch(subscribeNotificationTokenRefresh(userId)),
});

class AuthWithListeners extends Component {
  static propTypes = {
    appListeners: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    subscribeToSelf: PropTypes.func.isRequired,
    subscribeToFriendships: PropTypes.func.isRequired,
    subscribeNotificationTokenRefresh: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.subscriptions = [];
  }

  async componentDidMount() {
    // console.log(this.props.appListeners.user.uid);

    // const test = this.props.subscribeToSelf(this.props.appListeners.user.uid);
    // console.log(test);

    this.subscriptions.push(this.props.subscribeToSelf(await this.props.appListeners.user.uid));
    this.subscriptions.push(
      await this.props.subscribeToFriendships(this.props.appListeners.user.uid),
    );
    this.subscriptions.push(
      await this.props.subscribeNotificationTokenRefresh(this.props.appListeners.user.uid),
    );
  }

  componentDidUpdate() {
    if (this.props.appListeners.self) {
      // if (this.props.appListeners.self && this.props.appListeners.friends) {
      this.props.navigation.navigate('Feed');
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((subscription) => {
      subscription();
    });
  }

  render() {
    if (this.props.appListeners.self) {
      return <Feed />;
    }
    return <AppLoading />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthWithListeners);
