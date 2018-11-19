import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStackNavigator } from "react-navigation";
import { initializeListeners } from "react-navigation-redux-helpers";

import { RootNavigator } from "../../config/Routes";
import { navigationPropConstructor } from "../../redux/ReduxNavigation";

const mapStateToProps = state => {
  return {
    nav: state.nav
  };
};

class AppWithNavigation extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired
  };

  componentDidMount() {
    initializeListeners("root", this.props.nav);
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = navigationPropConstructor(dispatch, nav);
    return <RootNavigator navigation={navigation} />;
  }
}

export default connect(mapStateToProps)(AppWithNavigation);
