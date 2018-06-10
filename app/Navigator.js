import React, { Component } from 'react';
import {
  createStackNavigator,
  SwitchNavigator
} from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initializeListeners } from 'react-navigation-redux-helpers';

import Feed from './containers/Feed';
import Queue from './containers/Queue';
import Login from './containers/Login';
import { navigationPropConstructor } from './lib/ReduxNavigation';


export const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  Feed: { screen: Feed },
  Queue: { screen: Queue },
});

class AppWithNavigationState extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  componentDidMount() {
    initializeListeners('root', this.props.nav);
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = navigationPropConstructor(dispatch, nav);
    return <AppNavigator navigation={navigation} />;
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
