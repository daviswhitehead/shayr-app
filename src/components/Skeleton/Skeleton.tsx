import React, { memo, SFC } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../styles/Colors';
import styles from './styles';

export interface Props {
  childStyle: any;
}

const Skeleton: SFC<Props> = ({ childStyle }: Props) => {
  return (
    <SkeletonPlaceholder backgroundColor={Colors.SKELETON}>
      <View style={[styles.defaults, childStyle]} />
    </SkeletonPlaceholder>
  );
};

export default memo(Skeleton);
