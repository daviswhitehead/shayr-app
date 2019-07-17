import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import SwipeCard from '../../components/SwipeCard';
import { startSignOut } from '../../redux/auth/actions';
import colors from '../../styles/Colors';
import styles from './styles';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  startSignOut: () => dispatch(startSignOut())
});

class Friends extends Component {
  static propTypes = {
    startSignOut: PropTypes.func.isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired
  };

  static navigationOptions = () => ({
    header: (
      <Header
        backgroundColor={colors.WHITE}
        statusBarStyle='dark-content'
        title='Hello World'
      />
    )
  });
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text>COMING SOON</Text>
        <Button onPress={this.props.startSignOut} title='Log Out' />
        <SwipeCard>
          <View style={styles.sampleView} />
        </SwipeCard>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
