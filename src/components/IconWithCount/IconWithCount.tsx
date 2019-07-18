import * as React from 'react';
import { Text, View } from 'react-native';
import Icon from '../Icon';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

export interface Props extends Icon.Props {
  count: number;
}

const IconWithCount: React.SFC<Props> = ({
  count,
  name,
  isActive = false,
  onPress,
  style = {}
}: Props) => {
  return (
    <TouchableWrapper style={[styles.container, style]} onPress={onPress}>
      <Icon.default name={name} isActive={isActive} style={style} />
      <View style={styles.countBox}>
        <Text style={isActive ? styles.activeCount : styles.count}>
          {count}
        </Text>
      </View>
    </TouchableWrapper>
  );
};

export default IconWithCount;
