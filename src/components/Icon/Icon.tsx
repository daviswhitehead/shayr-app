import _ from 'lodash';
import React, { ComponentProps, memo, SFC } from 'react';
import { Image, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

export enum names {
  ACCEPT_FRIEND = 'accept-friend',
  ADD = 'add',
  ADD_FRIEND = 'add-friend',
  AT_SIGN = 'at-sign',
  BACK = 'back',
  BELL = 'bell',
  BELL_ACTIVE = 'bell-active',
  DONE = 'done',
  DISCOVER = 'discover',
  DISCOVER_ACTIVE = 'discover-active',
  FACEBOOK = 'facebook',
  FLAME = 'flame',
  FRIENDS = 'friends',
  FRIENDS_ACTIVE = 'friends-active',
  HOURGLASS = 'hourglass',
  INVITE = 'invite',
  INVITE_ALT = 'invite-alt',
  LIKE = 'like',
  LIST = 'list',
  LIST_ACTIVE = 'list-active',
  PENDING_FRIEND = 'pending-friend',
  PENDING_FRIEND_ALT = 'pending-friend-alt',
  PERSON = 'person',
  REACTION = 'reaction',
  REACTION_ACTIVE = 'reaction-active',
  REMOVE_FRIEND = 'remove-friend',
  SEARCH = 'search',
  SEARCH_ACTIVE = 'search-active',
  SETTINGS = 'settings',
  SHARE = 'share',
  X_EXIT = 'x-exit'
}

const iconMap = {
  [names.ACCEPT_FRIEND]: require('../../assets/icons/icon-accept-friend.png'),
  [names.ADD_FRIEND]: require('../../assets/icons/icon-add-friend.png'),
  [names.ADD]: require('../../assets/icons/icon-add.png'),
  [names.AT_SIGN]: require('../../assets/icons/icon-at-sign.png'),
  [names.BACK]: require('../../assets/icons/icon-back.png'),
  [names.BELL]: require('../../assets/icons/icon-bell.png'),
  [names.BELL_ACTIVE]: require('../../assets/icons/icon-bell-active.png'),
  [names.DONE]: require('../../assets/icons/icon-done.png'),
  [names.DISCOVER]: require('../../assets/icons/icon-discover.png'),
  [names.DISCOVER_ACTIVE]: require('../../assets/icons/icon-discover-active.png'),
  [names.FACEBOOK]: (props: any) => (
    <MaterialCommunityIcon name='facebook-box' size={props.size} />
  ),
  [names.FLAME]: require('../../assets/icons/icon-flame.png'),
  [names.FRIENDS_ACTIVE]: require('../../assets/icons/icon-friends-active.png'),
  [names.FRIENDS]: require('../../assets/icons/icon-friends.png'),
  [names.HOURGLASS]: require('../../assets/icons/icon-hourglass.png'),
  [names.INVITE_ALT]: require('../../assets/icons/icon-invite-alt.png'),
  [names.INVITE]: require('../../assets/icons/icon-invite.png'),
  [names.LIKE]: require('../../assets/icons/icon-like.png'),
  [names.LIST_ACTIVE]: require('../../assets/icons/icon-list-active.png'),
  [names.LIST]: require('../../assets/icons/icon-list.png'),
  [names.PENDING_FRIEND_ALT]: require('../../assets/icons/icon-pending-friend-alt.png'),
  [names.PENDING_FRIEND]: require('../../assets/icons/icon-pending-friend.png'),
  [names.PERSON]: require('../../assets/icons/icon-person.png'),
  [names.REACTION_ACTIVE]: require('../../assets/icons/icon-reaction-active.png'),
  [names.REACTION]: require('../../assets/icons/icon-reaction.png'),
  [names.REMOVE_FRIEND]: require('../../assets/icons/icon-remove-friend.png'),
  [names.SEARCH_ACTIVE]: require('../../assets/icons/icon-search-active.png'),
  [names.SEARCH]: require('../../assets/icons/icon-search.png'),
  [names.SETTINGS]: require('../../assets/icons/icon-settings.png'),
  [names.SHARE]: require('../../assets/icons/icon-share.png'),
  [names.X_EXIT]: require('../../assets/icons/icon-x-exit.png')
};

const specialIcons = [names.FACEBOOK];

interface Props extends ComponentProps<typeof TouchableWrapper> {
  name: names;
  size?: number;
  isActive?: boolean;
  iconStyle?: any;
  isLoading?: boolean;
  hasBadge?: boolean;
}

const Icon: SFC<Props> = ({
  name,
  size,
  isActive = false,
  iconStyle = {},
  isLoading,
  style,
  onPress,
  noTouching,
  hasBadge = false
}: Props) => {
  const color: string = isActive ? Colors.YELLOW : Colors.BLACK;
  const _containerStyle = [styles.container, style];
  const _iconStyle = [
    styles.image,
    hasBadge ? {} : { tintColor: color },
    iconStyle
  ];

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
      {_.includes(specialIcons, name) ? (
        iconMap[name]({ style: { _iconStyle }, size })
      ) : (
        <Image source={iconMap[name]} style={_iconStyle} />
      )}
      {hasBadge && <View style={styles.badge} />}
    </TouchableWrapper>
  );
};

export default memo(Icon);
