import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

interface UserAtom {
  facebookProfilePhoto: string;
  shortName: string;
  firstName: string;
  lastName: string;
}

export interface Props extends UserAtom {
  shouldHideName?: boolean;
  isVertical?: boolean;
  onPress?: () => void | undefined;
  noTouching?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
}

const UserAvatar: SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  shortName,
  shouldHideName = false,
  isVertical = true,
  onPress,
  noTouching,
  isSelected = false,
  isLoading = false
}: Props) => {
  const _containerStyle = [
    styles.container,
    { flexDirection: isVertical ? 'column' : 'row' }
  ];

  if (isLoading) {
    return (
      <View style={_containerStyle}>
        <UserImage isLoading />
        {shouldHideName ? null : (
          <Skeleton
            childStyle={
              isVertical ? styles.skeletonVertical : styles.skeletonHorizontal
            }
          />
        )}
      </View>
    );
  }

  return (
    <TouchableWrapper
      style={_containerStyle}
      onPress={onPress}
      noTouching={noTouching}
    >
      <UserImage uri={facebookProfilePhoto} size='small' />
      {shouldHideName ? null : (
        <Text
          style={[
            isVertical ? styles.verticalName : styles.horizontalName,
            isSelected ? styles.selectedName : {}
          ]}
        >
          {isVertical ? `${shortName}` : `${firstName} ${lastName}`}
        </Text>
      )}
    </TouchableWrapper>
  );
};

export default memo(UserAvatar);
