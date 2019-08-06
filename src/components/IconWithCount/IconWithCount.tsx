import * as React from 'react';
import { Text, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../styles/Colors';
import Icon from '../Icon';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

export interface Props extends Icon.Props {
  count: number;
  isLoading?: boolean;
}

const IconWithCount: React.SFC<Props> = ({
  count,
  name,
  isActive = false,
  onPress,
  style = {},
  isLoading = false
}: Props) => {
  const _containerStyle = [styles.container, style];

  if (isLoading) {
    return (
      <View style={_containerStyle}>
        <SkeletonPlaceholder backgroundColor={Colors.SKELETON}>
          <View style={styles.skeleton} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <TouchableWrapper style={_containerStyle} onPress={onPress}>
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
