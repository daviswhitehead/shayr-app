import React, { memo, SFC } from 'react';
import { StatusBar as RNStatusBar, StatusBarStyle, View } from 'react-native';
import styles from './styles';

interface Props {
  barStyle: StatusBarStyle;
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

const StatusBar: SFC<Props> = ({
  barStyle,
  backgroundColor,
  translucent,
  hidden
}) => {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor
      }}
    >
      <RNStatusBar
        barStyle={barStyle}
        translucent={translucent}
        hidden={hidden}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

export default memo(StatusBar);
