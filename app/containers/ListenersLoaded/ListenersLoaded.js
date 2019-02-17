import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppLoading from '../../components/AppLoading';

const mapStateToProps = state => ({
  appListeners: state.appListeners,
});

class ListenersLoaded extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Object).isRequired,
    appListeners: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.props.navigation.navigate(this.props.appListeners.isAuthenticated ? 'App' : 'Auth');
  }

  render() {
    return <AppLoading />;
  }
}

export default connect(mapStateToProps)(ListenersLoaded);
