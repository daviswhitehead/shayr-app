import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppLoading from '../../components/AppLoading';

const mapStateToProps = state => ({
  auth: state.auth,
});

class ListenersLoaded extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Object).isRequired,
    auth: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.props.navigation.navigate(this.props.auth.isAuthenticated ? 'App' : 'Auth');
  }

  render() {
    return <AppLoading />;
  }
}

export default connect(mapStateToProps)(ListenersLoaded);
