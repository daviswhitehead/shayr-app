import * as React from 'react';
import { Text } from 'react-native';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

interface UserAtom {
  facebookProfilePhoto: string;
  firstName: string;
  lastName: string;
}

export interface Props extends UserAtom {
  isVertical?: boolean;
  onPress?: () => void | undefined;
}

const UserAvatar: React.SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  isVertical = true,
  onPress
}: Props) => {
  return (
    <TouchableWrapper
      style={[
        styles.container,
        { flexDirection: isVertical ? 'column' : 'row' }
      ]}
      onPress={onPress}
    >
      <UserImage uri={facebookProfilePhoto} size='small' />
      <Text style={isVertical ? styles.verticalName : styles.horizontalName}>
        {isVertical
          ? `${firstName} ${lastName.charAt(0)}`
          : `${firstName} ${lastName}`}
      </Text>
    </TouchableWrapper>
  );
};

export default UserAvatar;
