import * as React from 'react';
import { Image } from 'react-native';
// import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
// import icoMoonConfig from '../../assets/fonts/selection.json';
import colors from '../../styles/Colors';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

// https://www.reactnative.guide/12-svg-icons-using-react-native-vector-icons/12.1-creating-custom-iconset.html
// const Icons = createIconSetFromIcoMoon(icoMoonConfig);

const iconMap = {
  ['settings']: require('../../assets/icons/icon-settings.png'),
  ['search']: require('../../assets/icons/icon-search.png'),
  ['search-active']: require('../../assets/icons/icon-search-active.png'),
  ['person']: require('../../assets/icons/icon-person.png'),
  ['reaction']: require('../../assets/icons/icon-reaction.png'),
  ['x-exit']: require('../../assets/icons/icon-x-exit.png'),
  ['share']: require('../../assets/icons/icon-share.png'),
  ['done']: require('../../assets/icons/icon-done.png'),
  ['add']: require('../../assets/icons/icon-add.png'),
  ['back']: require('../../assets/icons/icon-back.png'),
  ['at-sign']: require('../../assets/icons/icon-at-sign.png'),
  ['flame']: require('../../assets/icons/icon-flame.png'),
  ['list']: require('../../assets/icons/icon-list.png'),
  ['list-active']: require('../../assets/icons/icon-list-active.png'),
  ['friends']: require('../../assets/icons/icon-friends.png'),
  ['friends-active']: require('../../assets/icons/icon-friends-active.png'),
  ['pending-friend-alt']: require('../../assets/icons/icon-pending-friend-alt.png'),
  ['pending-friend']: require('../../assets/icons/icon-pending-friend.png'),
  ['remove-friend']: require('../../assets/icons/icon-remove-friend.png'),
  ['add-friend']: require('../../assets/icons/icon-add-friend.png'),
  ['accept-friend']: require('../../assets/icons/icon-accept-friend.png'),
  ['invite']: require('../../assets/icons/icon-invite.png'),
  ['invite-alt']: require('../../assets/icons/icon-invite-alt.png'),
  ['like']: require('../../assets/icons/icon-like.png')
};

export type names =
  | 'settings'
  | 'search'
  | 'search-active'
  | 'person'
  | 'reaction'
  | 'x-exit'
  | 'share'
  | 'done'
  | 'add'
  | 'back'
  | 'at-sign'
  | 'flame'
  | 'list'
  | 'list-active'
  | 'friends'
  | 'friends-active'
  | 'pending-friend-alt'
  | 'pending-friend'
  | 'remove-friend'
  | 'add-friend'
  | 'accept-friend'
  | 'invite'
  | 'invite-alt'
  | 'like';

export interface Props {
  name: names;
  isActive?: boolean;
  onPress?: () => void | undefined;
  style?: any;
  iconStyle?: any;
}

const Icon: React.SFC<Props> = ({
  name,
  isActive = false,
  onPress,
  style = {},
  iconStyle = {}
}: Props) => {
  const color: string = isActive ? colors.YELLOW : colors.BLACK;

  const icon = (
    <Image
      source={iconMap[name]}
      style={[styles.image, { tintColor: color }, iconStyle]}
    />
  );
  // const icon = <Icons name={name} size={16} color={color} />;

  return (
    <TouchableWrapper style={[styles.container, style]} onPress={onPress}>
      {icon}
    </TouchableWrapper>
  );
};

export default Icon;
