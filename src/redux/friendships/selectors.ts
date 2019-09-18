import { documentId, Friendship } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { State } from '../Reducers';

const selectFriendships = (state: State) => state.friendships;

export const selectPendingFriendshipUserIds = createCachedSelector(
  selectFriendships,
  (state: State, authUserId: documentId) => authUserId,
  (
    state: State,
    authUserId: documentId,
    type: 'initiating' | 'receiving' | 'all'
  ) => type,
  (friendships, authUserId, type) => {
    if (_.isEmpty(friendships) || !authUserId || !type) {
      return;
    }

    return _.pull(
      _.uniq(
        _.reduce(
          friendships,
          (result, value: Friendship, key) => {
            if (value.status === 'pending') {
              type === 'all'
                ? result.push(...value[`userIds`])
                : result.push(value[`${type}UserId`]);
            }
            return result;
          },
          []
        )
      ),
      authUserId
    );
  }
)((state, type) => `friendships_${type}`);
