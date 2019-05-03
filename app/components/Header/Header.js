import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import ShayrStatusBar from './ShayrStatusBar';
import FontTitle from '../Text/FontTitle';
import createShadow from '../../styles/Shadows';
import HeaderBack from './HeaderBack';

class Header extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    statusBarStyle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shadow: PropTypes.bool,
    back: PropTypes.func,
    statusBarTranslucent: PropTypes.bool,
    statusBarHidden: PropTypes.bool,
  };

  static defaultProps = {
    shadow: false,
    back: null,
    statusBarTranslucent: true,
    statusBarHidden: false,
  };

  render() {
    const shadowStyle = this.props.shadow ? createShadow(4) : {};

    return (
      <View
        style={{
          ...styles.container,
          ...shadowStyle,
          backgroundColor: this.props.backgroundColor,
        }}
      >
        <ShayrStatusBar
          translucent={this.props.statusBarTranslucent}
          hidden={this.props.statusBarHidden}
          barStyle={this.props.statusBarStyle}
          backgroundColor={this.props.backgroundColor}
        />
        <SafeAreaView>
          <View
            style={{
              ...styles.header,
              backgroundColor: this.props.backgroundColor,
            }}
          >
            <View style={styles.headerBox}>
              <View style={styles.bookendsBox}>
                {this.props.back ? <HeaderBack onPress={this.props.back} /> : <View />}
              </View>
              <FontTitle text={this.props.title} />
              <View style={styles.bookendsBox} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default Header;
