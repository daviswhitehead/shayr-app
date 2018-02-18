import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default class closeButton extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }

  onPress = () => {
    this.setState({
      count: this.state.count+1
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.text}>close</Text>
          <View style={styles.hamburgerHelper}>
          </View>
        </TouchableOpacity>
     </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 20,
  },
  hamburgerHelper: {
    height: 10,
    width: 20,
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
})
