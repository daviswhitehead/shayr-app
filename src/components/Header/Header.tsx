import React, { memo, SFC } from 'react';
import { SafeAreaView, StatusBarStyle, Text, View } from 'react-native';
import { createShadow } from '../../styles/Shadows';
import Icon, { names } from '../Icon';
import ShayrStatusBar from './ShayrStatusBar';
import styles from './styles';

interface Props {
  backgroundColor: string;
  statusBarStyle: StatusBarStyle;
  title: string;
  shadow?: boolean;
  back?: () => void;
  statusBarTranslucent?: boolean;
  statusBarHidden?: boolean;
}

const Header: SFC<Props> = ({
  backgroundColor,
  statusBarStyle,
  title,
  shadow = false,
  back,
  statusBarTranslucent = false,
  statusBarHidden = false
}) => {
  const shadowStyle = shadow ? createShadow(4) : {};

  return (
    <View
      style={{
        ...styles.container,
        ...shadowStyle,
        backgroundColor
      }}
    >
      <ShayrStatusBar
        translucent={statusBarTranslucent}
        hidden={statusBarHidden}
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
      />
      <SafeAreaView>
        <View
          style={{
            ...styles.header,
            backgroundColor
          }}
        >
          <View style={styles.headerBox}>
            <View style={styles.bookendsBox}>
              {back ? <Icon name={names.BACK} onPress={back} /> : <View />}
            </View>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.bookendsBox} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default memo(Header);
