import { documentIds } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { updateFriendship } from '../../redux/friendships/actions';
import {
  getFriendshipIdOrder,
  getFriendshipStatus
} from '../../redux/friendships/helpers';
import { selectPendingFriendshipUserIds } from '../../redux/friendships/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  existingFriendIds: Array<documentIds>;
  pendingInitiatingFriendshipUserIds: Array<documentIds>;
  pendingReceivingFriendshipUserIds: Array<documentIds>;
}

interface DispatchProps {
  updateFriendship: typeof updateFriendship;
}

interface OwnProps {
  userId: string;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  const authFriends = selectUsersFromList(
    state,
    generateListKey(authUserId, queryTypes.USER_FRIENDS),
    'presentation'
  );
  return {
    authUserId,
    existingFriendIds: _.keys(authFriends),
    pendingInitiatingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      authUserId,
      'initiating'
    ),
    pendingReceivingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      authUserId,
      'receiving'
    )
  };
};

const mapDispatchToProps = {
  updateFriendship
};

const withFriendRequestDenial = (WrappedComponent: SFC) => (props: Props) => {
  const {
    // state
    authUserId,
    existingFriendIds = [],
    pendingInitiatingFriendshipUserIds = [],
    pendingReceivingFriendshipUserIds = [],
    // dispatch
    updateFriendship,
    // own
    userId,
    ...passThroughProps
  } = props;

  const friendshipStatus = getFriendshipStatus(
    existingFriendIds,
    pendingReceivingFriendshipUserIds,
    pendingInitiatingFriendshipUserIds,
    userId
  );

  const friendshipIdOrder = getFriendshipIdOrder(
    pendingInitiatingFriendshipUserIds,
    authUserId,
    userId
  );

  let onFriendshipStatusPress;
  if (authUserId === userId) {
    onFriendshipStatusPress = undefined;
  } else if (friendshipStatus === 'is-friends') {
    onFriendshipStatusPress = () => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.REMOVE_A_FRIEND
      });
      updateFriendship(friendshipIdOrder[0], friendshipIdOrder[1], 'removed');
    };
  } else if (friendshipStatus === 'can-accept-request') {
    onFriendshipStatusPress = () => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.REJECT_FRIEND_REQUEST
      });
      updateFriendship(friendshipIdOrder[0], friendshipIdOrder[1], 'rejected');
    };
  } else if (friendshipStatus === 'needs-recipient-acceptance') {
    onFriendshipStatusPress = () => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.DELETE_FRIEND_REQUEST
      });
      updateFriendship(friendshipIdOrder[0], friendshipIdOrder[1], 'deleted');
    };
  } else if (friendshipStatus === 'can-send-friend-request') {
    onFriendshipStatusPress = undefined;
  }

  return (
    <WrappedComponent
      friendshipStatus={friendshipStatus}
      onPress={onFriendshipStatusPress}
      {...passThroughProps}
    />
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
      areStatesEqual: (next, prev) => {
        const prevAuthUserId = selectAuthUserId(prev);
        const nextAuthUserId = selectAuthUserId(prev);

        return (
          nextAuthUserId === prevAuthUserId &&
          selectUsersFromList(
            next,
            generateListKey(nextAuthUserId, queryTypes.USER_FRIENDS),
            'presentation'
          ) ===
            selectUsersFromList(
              prev,
              generateListKey(prevAuthUserId, queryTypes.USER_FRIENDS),
              'presentation'
            ) &&
          selectPendingFriendshipUserIds(next, nextAuthUserId, 'initiating') ===
            selectPendingFriendshipUserIds(
              prev,
              prevAuthUserId,
              'initiating'
            ) &&
          selectPendingFriendshipUserIds(next, nextAuthUserId, 'receiving') ===
            selectPendingFriendshipUserIds(prev, prevAuthUserId, 'receiving')
        );
      }
    }
  ),
  withFriendRequestDenial
);
