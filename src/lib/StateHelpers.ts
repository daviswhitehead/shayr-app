import { UsersPostsType } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export const getActionActiveStatus = (
  userId: string,
  post: UsersPostsType,
  actionType: ActionType
) => {
  const userIds: Array<string> = _.get(post, [actionType], []);
  return _.includes(userIds, userId);
};
