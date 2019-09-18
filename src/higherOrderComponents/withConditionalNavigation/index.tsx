import IconWithCount from '../../components/IconWithCount';
import UserAvatar from '../../components/UserAvatar';
import UserImage from '../../components/UserImage';
import withConditionalNavigation from './withConditionalNavigation';

export default withConditionalNavigation;
export const UserAvatarWithMyListNavigation = withConditionalNavigation(
  UserAvatar,
  'MyList'
);
export const UserImageWithMyListNavigation = withConditionalNavigation(
  UserImage,
  'MyList'
);
export const IconWithCountFriendsNavigation = withConditionalNavigation(
  IconWithCount,
  'Friends'
);
