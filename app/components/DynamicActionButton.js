import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default class DynamicActionButton extends Component {
  constructor() {
    super();
  }

  ABIcon = () => {
    return (
      <Image
        style={styles.image}
        source={require('./VectorLogo.png')}
      />
    );
  }

  queueData = () => {
    return (
      {
        title: 'queue',
        iconName: 'library-books'
      }
    );
  }
  feedData = () => {
    return (
      {
        title: 'feed',
        iconName: 'list'
      }
    );
  }

  render() {
    let data = {}
    let nav = {}
    if (this.props.feed) {
      data = this.feedData();
      nav = this.props.feed;
    }
    if (this.props.queue) {
      data = this.queueData();
      nav = this.props.queue;
    }
    return (
      <ActionButton
        buttonColor='#F2C94C'
        renderIcon={() => this.ABIcon()}
        degrees={90}
      >
        <ActionButton.Item
          title={data.title}
          onPress={nav}
        >
          <MaterialIcons name={data.iconName} size={28} color='black' />
        </ActionButton.Item>
        <ActionButton.Item
          title='logout'
          onPress={this.props.logout}
        >
          <MaterialCommunityIcons name='logout' size={28} color='black' />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    width: 36,
    height: 36,
  },
});