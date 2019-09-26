import React, { memo, SFC } from 'react';
import { Text } from 'react-native';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

interface Props {
  text: string;
  onPress: () => void;
  containerStyle?: any;
  textStyle?: any;
}

const PrimaryButton: SFC<Props> = ({
  text,
  onPress,
  containerStyle,
  textStyle
}: Props) => {
  return (
    <TouchableWrapper
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableWrapper>
  );
};

export default memo(PrimaryButton);
