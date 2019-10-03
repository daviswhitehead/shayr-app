import React, { memo, SFC } from 'react';
import { SafeAreaView, StatusBarStyle, Text, View } from 'react-native';
import { createShadow } from '../../styles/Shadows';
import Icon, { names } from '../Icon';
import StatusBar from '../StatusBar';
import styles from './styles';

interface Props {
  backgroundColor: string;
  statusBarStyle: StatusBarStyle;
  title: string;
  shadow?: boolean;
  back?: () => void;
  statusBarTranslucent?: boolean;
  statusBarHidden?: boolean;
  rightIcons?: JSX.Element[] | JSX.Element;
  leftIcons?: JSX.Element[] | JSX.Element;
}

const Header: SFC<Props> = ({
  backgroundColor,
  statusBarStyle,
  title,
  shadow = false,
  back,
  statusBarTranslucent = true,
  statusBarHidden = false,
  rightIcons,
  leftIcons
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
      <StatusBar
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
              {!!leftIcons && leftIcons}
            </View>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.bookendsBox}>{!!rightIcons && rightIcons}</View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default memo(Header);
