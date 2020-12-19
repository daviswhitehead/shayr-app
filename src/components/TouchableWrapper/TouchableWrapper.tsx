import React, { memo, SFC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { eventName, logEvent, params } from '../../lib/FirebaseAnalytics';

interface Props {
  children?: JSX.Element[] | JSX.Element;
  style?: any;
  onPress?: () => void | undefined;
  noTouching?: boolean;
  eventName?: eventName;
  eventParams?: params;
}

const TouchableWrapper: SFC<Props> = ({
  children,
  style,
  onPress,
  noTouching,
  eventName,
  eventParams = {}
}: Props) => {
  return onPress && !noTouching ? (
    <TouchableOpacity
      style={style}
      onPress={() => {
        eventName && logEvent(eventName, eventParams);
        onPress();
      }}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View style={style}>{children}</View>
  );
};

export default memo(TouchableWrapper);
