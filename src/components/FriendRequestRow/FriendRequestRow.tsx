import React, { memo, SFC } from 'react';
import { View } from 'react-native';
import Icon, { names } from '../Icon';
import UserAvatar from '../UserAvatar';
import styles from './styles';

// TODO: combine disparate UserAtom definitions
interface UserAtom {
  facebookProfilePhoto: string;
  firstName: string;
  lastName: string;
}

export interface Props extends UserAtom {
  friendStatus:
    | 'can-send-friend-request'
    | 'needs-recipient-acceptance'
    | 'can-accept-request';
  isLoading?: boolean;
}

const FriendRequestRow: SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  isLoading,
  friendStatus
}: Props) => {
  const friendStatusIconMap = {
    ['can-send-friend-request']: names.ADD_FRIEND,
    ['needs-recipient-acceptance']: names.PENDING_FRIEND,
    ['can-accept-request']: names.ACCEPT_FRIEND
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <UserAvatar isLoading isVertical={false} />
        <View style={styles.iconsContainer}>
          <Icon isLoading />
          <View style={styles.actionsSpacer} />
          <Icon isLoading />
        </View>
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
      <View style={styles.iconsContainer}>
        <Icon name={friendStatusIconMap[friendStatus]} />
        <View style={styles.actionsSpacer} />
        <Icon name={names.X_EXIT} />
      </View>
    </View>
  );
};

export default memo(FriendRequestRow);
