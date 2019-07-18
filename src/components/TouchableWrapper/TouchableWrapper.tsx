import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface Props {
  children: JSX.Element[] | JSX.Element;
  onPress?: () => void | undefined;
  style?: any;
}

const TouchableWrapper: React.SFC<Props> = ({
  children,
  onPress,
  style
}: Props) => {
  return onPress ? (
    <TouchableOpacity style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={style}>{children}</View>
  );
};

export default TouchableWrapper;
