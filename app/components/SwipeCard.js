import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import ContentCard from './ContentCard';

export default class SwipeCard extends Component {
  constructor() {
    super();
    this.state = {
      leftActionActivated: false,
      rightActionActivated: false
    };
  }

  leftToRight = () => {
    return (
      <View
        style={styles.leftSwipeItem}
      >
        {leftActionActivated ?
        <Text>release!</Text> :
        <Text>keep pulling!</Text>}
      </View>
    )
  }

  render() {
    const {leftActionActivated, toggle} = this.state;
    console.log(this.state);
    console.log(this.props);
    return (
      <Swipeable
        leftActionActivationDistance={200}
        leftContent={() => this.leftToRight()}
        onLeftActionActivate={() => this.setState({leftActionActivated: true})}
        onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
        onLeftActionComplete={() => this.setState({toggle: !toggle})}
      >
        <ContentCard payload={this.props.payload} />
      </Swipeable>
    );
  }

}

const styles = StyleSheet.create({
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    backgroundColor: 'green',
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  }
});
