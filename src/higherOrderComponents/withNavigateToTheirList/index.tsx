import UserAvatar from '../../components/UserAvatar';
import UserImage from '../../components/UserImage';
import withNavigateToTheirList from './withNavigateToTheirList';

export default withNavigateToTheirList;
export const UserAvatarWithNavigateToTheirList = withNavigateToTheirList(
  UserAvatar
);
export const UserImageWithNavigateToTheirList = withNavigateToTheirList(
  UserImage
);
