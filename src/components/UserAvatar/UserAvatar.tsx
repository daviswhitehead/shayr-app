import * as React from 'react';
import { Text } from 'react-native';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

interface UserAtom {
  facebookProfilePhoto: string;
  firstName?: string;
  lastName?: string;
  _id?: string;
}

export interface Props extends UserAtom {
  isVertical?: boolean;
  onPress?: () => void | undefined;
  noTouching?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
}

const mapDispatchToProps = (dispatch: any) => ({});

const UserAvatar: React.SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  isVertical = true,
  onPress,
  noTouching,
  isSelected = false,
  isLoading = false
}: Props) => {
  if (isLoading) {
    return null;
  }

  return (
    <TouchableWrapper
      style={[
        styles.container,
        { flexDirection: isVertical ? 'column' : 'row' }
      ]}
      onPress={noTouching ? undefined : onPress}
    >
      <UserImage uri={facebookProfilePhoto} size='small' />
      {firstName && lastName ? (
        <Text
          style={[
            isVertical ? styles.verticalName : styles.horizontalName,
            isSelected ? styles.selectedName : {}
          ]}
        >
          {isVertical
            ? `${firstName} ${lastName.charAt(0)}`
            : `${firstName} ${lastName}`}
        </Text>
      ) : null}
    </TouchableWrapper>
  );
};

export default UserAvatar;
