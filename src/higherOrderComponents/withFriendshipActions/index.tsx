import Icon from '../../components/Icon';
import IconWithCount from '../../components/IconWithCount';
import withFriendshipActions from './withFriendshipActions';

export default withFriendshipActions;
export const IconWithFriendshipActions = withFriendshipActions(Icon);
export const IconWithCountWithFriendshipActions = withFriendshipActions(
  IconWithCount
);
