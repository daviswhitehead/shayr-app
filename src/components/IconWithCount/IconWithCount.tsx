import React, { ComponentProps, memo, SFC } from 'react';
import { Text, View } from 'react-native';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import Icon from '../Icon';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

interface Props
  extends ComponentProps<typeof Icon>,
    ComponentProps<typeof TouchableWrapper> {
  count: number;
}

const IconWithCount: SFC<Props> = ({
  count,
  name,
  isActive = false,
  onPress,
  noTouching,
  style = {},
  isLoading = false
}: Props) => {
  const _containerStyle = [styles.container, style];

  if (isLoading) {
    return (
      <View style={_containerStyle}>
        <Skeleton childStyle={styles.skeleton} />
      </View>
    );
  }

  return (
    <TouchableWrapper
      style={_containerStyle}
      onPress={onPress}
      noTouching={noTouching}
      eventName={AnalyticsDefinitions.category.ACTION}
      eventParams={{
        [AnalyticsDefinitions.parameters.LABEL]: name,
        [AnalyticsDefinitions.parameters.TYPE]: AnalyticsDefinitions.type.PRESS,
        [AnalyticsDefinitions.parameters.RESULT]: count,
        [AnalyticsDefinitions.parameters.STATUS]: isActive
          ? AnalyticsDefinitions.status.ACTIVE
          : AnalyticsDefinitions.status.INACTIVE
      }}
    >
      <Icon name={name} isActive={isActive} style={style} />
      <View style={styles.countBox}>
        <Text style={isActive ? styles.activeCount : styles.count}>
          {count}
        </Text>
      </View>
    </TouchableWrapper>
  );
};

export default memo(IconWithCount);
