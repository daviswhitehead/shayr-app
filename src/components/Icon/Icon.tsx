import React, { ComponentProps, memo, SFC } from 'react';
import { Image, View } from 'react-native';
import Colors from '../../styles/Colors';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

export enum names {
  SETTINGS = 'settings',
  SEARCH = 'search',
  SEARCH_ACTIVE = 'search-active',
  PERSON = 'person',
  REACTION = 'reaction',
  REACTION_ACTIVE = 'reaction-active',
  X_EXIT = 'x-exit',
  SHARE = 'share',
  DONE = 'done',
  ADD = 'add',
  BACK = 'back',
  AT_SIGN = 'at-sign',
  FLAME = 'flame',
  LIST = 'list',
  LIST_ACTIVE = 'list-active',
  FRIENDS = 'friends',
  FRIENDS_ACTIVE = 'friends-active',
  PENDING_FRIEND_ALT = 'pending-friend-alt',
  PENDING_FRIEND = 'pending-friend',
  REMOVE_FRIEND = 'remove-friend',
  ADD_FRIEND = 'add-friend',
  ACCEPT_FRIEND = 'accept-friend',
  INVITE = 'invite',
  INVITE_ALT = 'invite-alt',
  LIKE = 'like'
}

const iconMap = {
  [names.SETTINGS]: require('../../assets/icons/icon-settings.png'),
  [names.SEARCH]: require('../../assets/icons/icon-search.png'),
  [names.SEARCH_ACTIVE]: require('../../assets/icons/icon-search-active.png'),
  [names.PERSON]: require('../../assets/icons/icon-person.png'),
  [names.REACTION]: require('../../assets/icons/icon-reaction.png'),
  [names.REACTION_ACTIVE]: require('../../assets/icons/icon-reaction-active.png'),
  [names.X_EXIT]: require('../../assets/icons/icon-x-exit.png'),
  [names.SHARE]: require('../../assets/icons/icon-share.png'),
  [names.DONE]: require('../../assets/icons/icon-done.png'),
  [names.ADD]: require('../../assets/icons/icon-add.png'),
  [names.BACK]: require('../../assets/icons/icon-back.png'),
  [names.AT_SIGN]: require('../../assets/icons/icon-at-sign.png'),
  [names.FLAME]: require('../../assets/icons/icon-flame.png'),
  [names.LIST]: require('../../assets/icons/icon-list.png'),
  [names.LIST_ACTIVE]: require('../../assets/icons/icon-list-active.png'),
  [names.FRIENDS]: require('../../assets/icons/icon-friends.png'),
  [names.FRIENDS_ACTIVE]: require('../../assets/icons/icon-friends-active.png'),
  [names.PENDING_FRIEND_ALT]: require('../../assets/icons/icon-pending-friend-alt.png'),
  [names.PENDING_FRIEND]: require('../../assets/icons/icon-pending-friend.png'),
  [names.REMOVE_FRIEND]: require('../../assets/icons/icon-remove-friend.png'),
  [names.ADD_FRIEND]: require('../../assets/icons/icon-add-friend.png'),
  [names.ACCEPT_FRIEND]: require('../../assets/icons/icon-accept-friend.png'),
  [names.INVITE]: require('../../assets/icons/icon-invite.png'),
  [names.INVITE_ALT]: require('../../assets/icons/icon-invite-alt.png'),
  [names.LIKE]: require('../../assets/icons/icon-like.png')
};

interface Props extends ComponentProps<typeof TouchableWrapper> {
  name: names;
  isActive?: boolean;
  iconStyle?: any;
  isLoading?: boolean;
}

const Icon: SFC<Props> = ({
  name,
  isActive = false,
  iconStyle = {},
  isLoading,
  style,
  onPress,
  noTouching
}: Props) => {
  const color: string = isActive ? Colors.YELLOW : Colors.BLACK;
  const _containerStyle = [styles.container, style];
  const _iconStyle = [styles.image, { tintColor: color }, iconStyle];

  if (isLoading) {
    return (
      <View style={_containerStyle}>
        <Skeleton childStyle={_iconStyle} />
      </View>
    );
  }

  return (
    <TouchableWrapper
      style={_containerStyle}
      onPress={onPress}
      noTouching={noTouching}
    >
      <Image source={iconMap[name]} style={_iconStyle} />
    </TouchableWrapper>
  );
};

export default memo(Icon);
