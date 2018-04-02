import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { NavigationActions } from 'react-navigation';

export default class DrawerMenu extends Component {
  _navigate(route) {
    return this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: `${route}` })]
      })
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            this._navigate('Feed', { isStatusBarHidden: false })}
        >
          <Text style={styles.menuItemText}>FEED</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => this._navigate('Queue', { isStatusBarHidden: false })}
        >
          <Text style={styles.menuItemText}>QUEUE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100
  },
  menuItem: {
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(12, 12, 12, 0.2)',
    marginBottom: 2
  },
  menuItemText: {
    fontSize: 20
  }
});
