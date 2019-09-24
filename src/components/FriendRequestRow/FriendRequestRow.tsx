import React, { memo, SFC } from 'react';
import { View } from 'react-native';
import { UserAvatarWithMyListNavigation } from '../../higherOrderComponents/withConditionalNavigation';
import { IconWithFriendRequestDenial } from '../../higherOrderComponents/withFriendRequestDenial';
import { IconWithFriendshipActions } from '../../higherOrderComponents/withFriendshipActions';
import Icon, { names } from '../Icon';
import UserAvatar from '../UserAvatar';
import styles from './styles';

// TODO: combine disparate UserAtom definitions
interface UserAtom {
  facebookProfilePhoto: string;
  firstName: string;
  lastName: string;
  _id: string;
}

interface Props extends UserAtom {
  friendStatus:
    | 'can-send-friend-request'
    | 'needs-recipient-acceptance'
    | 'can-accept-request';
  isLoading?: boolean;
  shouldRenderX?: boolean;
}

const FriendRequestRow: SFC<Props> = ({
  _id,
  facebookProfilePhoto,
  firstName,
  lastName,
  isLoading,
  shouldRenderX = true
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <UserAvatar isLoading isVertical={false} />
        <View style={styles.iconsContainer}>
          <Icon isLoading style={styles.actionsSpacer} />
          {shouldRenderX && <Icon isLoading />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserAvatarWithMyListNavigation
        facebookProfilePhoto={facebookProfilePhoto}
        firstName={firstName}
        lastName={lastName}
        isVertical={false}
        userId={_id}
      />
      <View style={styles.iconsContainer}>
        <IconWithFriendshipActions
          userId={_id}
          screen={'FindFriends'}
          style={styles.actionsSpacer}
        />
        {shouldRenderX && (
          <IconWithFriendRequestDenial userId={_id} name={names.X_EXIT} />
        )}
      </View>
    </View>
  );
};

export default memo(FriendRequestRow);
