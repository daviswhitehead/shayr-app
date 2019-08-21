import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CommentModal from '../../components/CommentModal';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { State } from '../../redux/Reducers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  friends?: {
    [userId: string]: User;
  };
}

interface OwnProps {
  ownerUserId: string;
  postId: string;
  usersPostsComments: Array<string>;
}

type Props = OwnProps & StateProps;

const mapStateToProps = (state: State) => {
  return {
    authUserId: selectAuthUserId(state),
    friends: selectUsersFromList(
      state,
      `${selectAuthUserId(state)}_Friends`,
      true
    )
  };
};

const withComments = (WrappedComponent: SFC) => (props: Props) => {
  const {
    authUserId,
    friends = [],
    ownerUserId,
    postId,
    usersPostsComments,
    ...passThroughProps
  } = props;

  const isActive = _.includes(usersPostsComments, authUserId);
  const modalRef = React.useRef();

  return (
    <View>
      <WrappedComponent
        isActive={isActive}
        onPress={modalRef ? () => modalRef.current.toggleModal() : null}
        {...passThroughProps}
      />
      <CommentModal
        authUserId={authUserId}
        ownerUserId={authUserId}
        postId={postId}
        ref={modalRef}
        visibleToUserIds={[authUserId, ..._.keys(friends)]}
        {...passThroughProps}
      />
    </View>
  );
};

export default compose(
  connect(
    mapStateToProps,
    undefined,
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
  withComments
);
