import { Friendship } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { State } from '../Reducers';

const selectFriendships = (state: State) => state.friendships;

export const selectPendingFriendshipUserIds = createCachedSelector(
  selectFriendships,
  (state: State, type: 'initiating' | 'receiving') => type,
  (friendships, type) => {
    if (_.isEmpty(friendships) || !type) {
      return [];
    }

    return _.reduce(
      friendships,
      (result, value: Friendship, key) => {
        if (value.status === 'pending') {
          result.push(value[`${type}UserId`]);
        }
        return result;
      },
      []
    );
  }
)((state, type) => `friendships_${type}`);
