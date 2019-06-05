import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header';
import colors from '../../styles/Colors';
import styles from './styles';
import { startSignOut } from '../../redux/auth/actions';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  startSignOut: () => dispatch(startSignOut()),
});

class Friends extends Component {
  static propTypes = {
    startSignOut: PropTypes.func.isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
  };

  static navigationOptions = () => ({
    header: (
      <Header backgroundColor={colors.WHITE} statusBarStyle="dark-content" title="Hello World" />
    ),
  });

  signOut = () => {
    this.props.startSignOut();
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>COMING SOON</Text>
        <Button onPress={() => this.signOut()} title="Log Out" />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Friends);
