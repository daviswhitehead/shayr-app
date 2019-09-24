import { documentId, documentIds } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { names } from '../../components/Icon';
import { Toaster } from '../../components/Toaster';
import { friending } from '../../styles/Copy';

export type FriendshipStatus =
  | 'is-friends'
  | 'can-send-friend-request'
  | 'needs-recipient-acceptance'
  | 'can-accept-request';

export const friendshipStatusIconMap = {
  ['is-friends']: names.PERSON,
  ['can-send-friend-request']: names.ADD_FRIEND,
  ['needs-recipient-acceptance']: names.PENDING_FRIEND,
  ['can-accept-request-alt']: names.DONE,
  ['can-accept-request']: names.ACCEPT_FRIEND
};

export const friendRequestStatusIconMap = {
  ['is-friends']: names.PERSON,
  ['can-send-friend-request']: names.ADD,
  ['needs-recipient-acceptance']: names.HOURGLASS,
  ['can-accept-request']: names.DONE
};

export const awaitingRecipientAcceptance = () => {
  Toaster(friending.awaiting);
};

export const getFriendshipStatus = (
  existingFriendIds: Array<documentIds>,
  pendingReceivingFriendshipUserIds: Array<documentIds>,
  pendingInitiatingFriendshipUserIds: Array<documentIds>,
  userId: documentId
) => {
  return (
    (_.includes(existingFriendIds, userId) && 'is-friends') ||
    (_.includes(pendingInitiatingFriendshipUserIds, userId) &&
      'can-accept-request') ||
    (_.includes(pendingReceivingFriendshipUserIds, userId) &&
      'needs-recipient-acceptance') ||
    'can-send-friend-request'
  );
};

export const getFriendshipIdOrder = (
  pendingInitiatingFriendshipUserIds: Array<documentIds>,
  authUserId: documentId,
  userId: documentId
) => {
  const initiatingUserId = _.includes(
    pendingInitiatingFriendshipUserIds,
    userId
  )
    ? userId
    : authUserId;
  const receivingUserId = initiatingUserId === authUserId ? userId : authUserId;
  return [initiatingUserId, receivingUserId];
};

export const getFriendshipId = (
  initiatingUserId: documentId,
  receivingUserId: documentId
) => {
  return `${initiatingUserId}_${receivingUserId}`;
};
