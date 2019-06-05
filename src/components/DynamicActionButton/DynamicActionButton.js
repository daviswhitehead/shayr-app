import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import vectorLogo from '../../assets/VectorLogo.png';
import colors from '../../styles/Colors';

export default class DynamicActionButton extends Component {
  actionButtonIcon = () => <Image style={styles.image} source={vectorLogo} />;

  queueData = () => ({
    title: 'queue',
    iconName: 'library-books',
  });

  feedData = () => ({
    title: 'feed',
    iconName: 'list',
  });

  render() {
    let data = {};
    let nav = {};
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
        buttonColor={colors.YELLOW}
        renderIcon={() => this.actionButtonIcon()}
        degrees={90}
      >
        <ActionButton.Item title={data.title} onPress={nav}>
          <MaterialIcons name={data.iconName} size={28} color={colors.BLACK} />
        </ActionButton.Item>
        <ActionButton.Item title="logout" onPress={this.props.logout}>
          <MaterialCommunityIcons name="logout" size={28} color={colors.BLACK} />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}
