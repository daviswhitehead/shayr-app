import React, { memo, SFC } from 'react';
import { StatusBar, StatusBarStyle, View } from 'react-native';
import styles from './styles';

interface Props {
  barStyle: StatusBarStyle;
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

const ShayrStatusBar: SFC<Props> = ({
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
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        hidden={hidden}
      />
    </View>
  );
};

export default memo(ShayrStatusBar);
