import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import FontHeadingOne from '../Text/FontHeadingOne';

export default class PostContext extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
    actions: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.bool]),
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textBox}>
          <FontHeadingOne text={this.props.title} />
          <Text style={styles.publisher}>{this.props.publisher}</Text>
        </View>
        {this.props.actions ? (
          <View style={styles.actionsBox}>{this.props.actions}</View>
        ) : (
          <View style={styles.actionsBox} />
        )}
      </View>
    );
  }
}
