import React, { ComponentProps, memo, SFC } from 'react';
import { Image, View } from 'react-native';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import colors from '../../styles/Colors';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

export type size = 'small' | 'medium' | 'large';

interface Props extends ComponentProps<typeof TouchableWrapper> {
  uri: string;
  size?: string;
  onPress?: () => void | undefined;
  style?: any;
  isLoading?: boolean;
}

const UserImage: SFC<Props> = ({
  uri,
  size = 'small',
  onPress,
  noTouching,
  style = {},
  isLoading
}: Props) => {
  const _containerStyle = [styles.imageBox, style];

  if (isLoading) {
    return (
      <View style={_containerStyle}>
        <Skeleton childStyle={styles[size]} />
      </View>
    );
  }

  return (
    <TouchableWrapper
      onPress={onPress}
      style={_containerStyle}
      noTouching={noTouching}
      eventName={AnalyticsDefinitions.category.ACTION}
      eventParams={{
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.USER_AVATAR,
        [AnalyticsDefinitions.parameters.TYPE]: AnalyticsDefinitions.type.PRESS
      }}
    >
      {!!uri ? (
        <Image style={styles[size]} source={{ uri }} />
      ) : (
        <View
          style={{
            ...styles[size],
            backgroundColor: colors.LIGHT_GRAY
          }}
        />
      )}
    </TouchableWrapper>
  );
};

export default memo(UserImage);
