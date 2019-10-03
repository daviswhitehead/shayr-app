import _ from 'lodash';
import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListCount } from '../../redux/lists/selectors';

interface StateProps {
  authUserId: string;
  friendsCount: number;
}

interface DispatchProps {}

interface OwnProps {}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  return {
    authUserId,
    friendsCount: selectListCount(
      state,
      'usersLists',
      generateListKey(authUserId, queryTypes.USER_FRIENDS)
    )
  };
};

const withFriendCount = (WrappedComponent: SFC) => (props: Props) => {
  const {
    // state
    authUserId,
    friendsCount,
    // dispatch
    // own
    ...passThroughProps
  } = props;

  return (
    <WrappedComponent
      friendsCount={friendsCount}
      hasBadge={friendsCount === 0}
      {...passThroughProps}
    />
  );
};

export default compose(
  connect(
    mapStateToProps,
    undefined,
    undefined,
    {
      areStatesEqual: (next, prev) => {
        const prevAuthUserId = selectAuthUserId(prev);
        const nextAuthUserId = selectAuthUserId(prev);

        return (
          nextAuthUserId === prevAuthUserId &&
          selectListCount(
            next,
            'usersLists',
            generateListKey(nextAuthUserId, queryTypes.USER_FRIENDS)
          ) ===
            selectListCount(
              prev,
              'usersLists',
              generateListKey(prevAuthUserId, queryTypes.USER_FRIENDS)
            )
        );
      }
    }
  ),
  withFriendCount
);
