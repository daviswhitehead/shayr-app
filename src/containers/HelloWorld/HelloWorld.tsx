import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import UserAvatarsScrollView from '../../components/UserAvatarsScrollView';
import styles from './styles';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.subscriptions.push();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  render() {
    console.log(this.state);
    console.log(this.props);

    return (
      <View style={styles.screen}>
        {/* <View style={styles.container}> */}
        <Text>Hello World</Text>
        <UserAvatarsScrollView />
        {/* </View> */}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloWorld);
