import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { queryTypes } from '../../lib/FirebaseQueries';
import { toggleAddDonePost } from '../../redux/adds/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  friends?: {
    [userId: string]: User;
  };
}

interface DispatchProps {
  toggleAddDonePost: typeof toggleAddDonePost;
}

interface OwnProps {
  ownerUserId: string;
  postId: string;
  usersPostsAdds: Array<string>;
  usersPostsDones: Array<string>;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  return {
    authUserId,
    friends: selectUsersFromList(
      state,
      generateListKey(authUserId, queryTypes.USER_FRIENDS),
      true
    )
  };
};

const mapDispatchToProps = {
  toggleAddDonePost
};

const withAdds = (WrappedComponent: SFC) => (props: Props) => {
  const {
    // state
    authUserId,
    friends = [],
    // dispatch
    toggleAddDonePost,
    // own
    ownerUserId,
    postId,
    usersPostsAdds,
    usersPostsDones,
    ...passThroughProps
  } = props;

  const isAddsActive = _.includes(usersPostsAdds, authUserId);
  const isDonesActive = _.includes(usersPostsDones, authUserId);

  return (
    <WrappedComponent
      isActive={isAddsActive}
      onPress={() =>
        toggleAddDonePost(
          'adds',
          isAddsActive,
          postId,
          ownerUserId,
          authUserId,
          isDonesActive,
          _.keys(friends)
        )
      }
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
            true
          ) ===
            selectUsersFromList(
              prev,
              generateListKey(prevAuthUserId, queryTypes.USER_FRIENDS),
              true
            )
        );
      }
    }
  ),
  withAdds
);
