import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import Icon, { names } from '../Icon';
import IconWithCount from '../IconWithCount';
import Skeleton from '../Skeleton';
import UserAvatar from '../UserAvatar';
import UserImage from '../UserImage';
import styles from './styles';

// TODO: combine disparate UserAtom definitions
interface UserAtom {
  facebookProfilePhoto: string;
  firstName: string;
  lastName: string;
}

export interface Props extends UserAtom {
  isLoading?: boolean;
  friendStatus?: string;
}

const PotentialFriendRow: SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  isLoading,
  friendStatus
}: Props) => {
  const friendStatusIconMap = {
    SEND_REQUEST: names.ADD_FRIEND,
    ACCEPT_REQUEST: names.ACCEPT_FRIEND,
    AWAITING_REQUEST_ACCEPT: names.PENDING_FRIEND,
    IS_FRIENDS: names.ACCEPT_FRIEND
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <UserAvatar isLoading isVertical={false} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserAvatar
        facebookProfilePhoto={facebookProfilePhoto}
        firstName={firstName}
        lastName={lastName}
        isVertical={false}
      />
      <Text>{friendStatus}</Text>
    </View>
  );
};

export default memo(PotentialFriendRow);
