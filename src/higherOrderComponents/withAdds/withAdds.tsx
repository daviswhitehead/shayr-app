import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toggleAddDonePost } from '../../redux/adds/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
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
  return {
    authUserId: selectAuthUserId(state),
    friends: selectUsersFromList(
      state,
      `${selectAuthUserId(state)}_Friends`,
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
        return (
          selectAuthUserId(next) === selectAuthUserId(prev) &&
          selectUsersFromList(next, `${selectAuthUserId(next)}_Friends`) ===
            selectUsersFromList(prev, `${selectAuthUserId(prev)}_Friends`)
        );
      }
    }
  ),
  withAdds
);
