import _ from 'lodash';
import firebase from 'react-native-firebase';
import { ts } from './FirebaseHelpers';

export type SetType = 'SHARE_POST' | 'ADD_POST' | 'DONE_POST' | 'LIKE_POST';
type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export const postActionSet = async (
  userId: string,
  post: any,
  action: ActionType
) => {
  const actionUsers = _.get(post, [action], []);

  const isNowActive = !_.includes(actionUsers, userId);
  const shareCount = Math.max(
    0,
    _.get(post, [`${action.slice(0, -1)}Count`], 0) + isNowActive ? +1 : -1
  );

  const newActionUsers = isNowActive
    ? [...actionUsers, userId]
    : [..._.pull(actionUsers, userId)];

  await firebase
    .firestore()
    .doc(post._reference)
    .set(
      {
        [action]: newActionUsers,
        shareCount,
        updatedAt: ts
      },
      { merge: true }
    );
};

export const requestTypes = {
  SHARE_POST: {
    type: 'SHARE_POST'
    // request: postActionSet(userId, post, 'shares')
  }
};
