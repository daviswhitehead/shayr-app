/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import globalRouter from '../glue/RouterSingleton';
import Home from '../components/Home';
import { initializeState } from '../state/storage';
import { Scaffold } from './Scaffold';

export default class App extends Component {
  state = {};
  constructor(props) {
    super(props);
  }
  initialize = async () => {
    await initializeState();
    globalRouter.setDefault(Home);
    globalRouter.listen(this.changeRoute);
  };
  componentDidMount() {
    this.initialize();
  }
  changeRoute = Route => {
    this.setState({ Route });
  };
  renderLoading() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  renderRoute() {
    const { Route } = this.state;
    const {
      component: Component,
      props,
      scaffold,
      headerLeft,
      headerRight,
      title
    } = Route;
    const componentView = <Component {...props} />;

    if (scaffold) {
      return (
        <Scaffold
          headerLeft={headerLeft}
          headerRight={headerRight}
          title={title}
        >
          {componentView}
        </Scaffold>
      );
    }
    return componentView;
  }
  render() {
    const { Route } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {Route ? this.renderRoute() : this.renderLoading()}
      </SafeAreaView>
    );
  }
}
