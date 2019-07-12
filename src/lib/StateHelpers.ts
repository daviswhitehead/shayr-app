import { UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export const getActionActiveStatus = (
  userId: string,
  post: UsersPosts,
  actionType: ActionType
) => {
  const userIds: Array<string> = _.get(post, [actionType], []);
  return _.includes(userIds, userId);
};
