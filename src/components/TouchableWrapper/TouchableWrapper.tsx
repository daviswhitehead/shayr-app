import React, { memo, SFC } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface Props {
  children?: JSX.Element[] | JSX.Element;
  style?: any;
  onPress?: () => void | undefined;
  noTouching?: boolean;
}

const TouchableWrapper: SFC<Props> = ({
  children,
  style,
  onPress,
  noTouching
}: Props) => {
  return onPress && !noTouching ? (
    <TouchableOpacity style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={style}>{children}</View>
  );
};

export default memo(TouchableWrapper);
