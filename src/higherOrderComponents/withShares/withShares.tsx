import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { memo, SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ShareModal from '../../components/ShareModal';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems } from '../../redux/lists/selectors';
import { State } from '../../redux/Reducers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  authShares: Array<string>;
  friends: {
    [userId: string]: User;
  };
}

interface OwnProps {
  ownerUserId: string;
  usersPostsId: string;
  postId: string;
}
// interface OwnProps {
//   usersPost: UsersPosts;
//   ownerUserId: string;
//   noTouching?: boolean;
//   passThroughProps: any;
// }

type Props = OwnProps & StateProps;

const mapStateToProps = (state: State) => {
  return {
    authUserId: selectAuthUserId(state),
    authShares: selectListItems(
      state,
      'sharesLists',
      generateListKey(selectAuthUserId(state), queryTypes.USER_SHARES)
    ),
    friends: selectUsersFromList(state, `${selectAuthUserId(state)}_Friends`)
  };
};

const withShares = (WrappedComponent: SFC) => (props: Props) => {
  const {
    authUserId,
    authShares,
    friends,
    ownerUserId,
    usersPostsId,
    postId,
    ...passThroughProps
  } = props;

  const isSharesActive = _.includes(authShares, usersPostsId);
  const modalRef = React.useRef();

  return (
    <View>
      <WrappedComponent
        isActive={isSharesActive}
        onPress={modalRef ? () => modalRef.current.toggleModal() : null}
        {...passThroughProps}
      />
      {/* <ShareModal
        ref={modalRef}
        authUserId={authUserId}
        ownerUserId={ownerUserId}
        payload={usersPost.url}
        url={usersPost.url}
        post={usersPost}
        postId={usersPost.postId}
        users={friends}
        // navigateToLogin={() => navigateToLogin()}
      /> */}
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
          selectListItems(
            next,
            'sharesLists',
            generateListKey(selectAuthUserId(next), queryTypes.USER_SHARES)
          ) ===
            selectListItems(
              prev,
              'sharesLists',
              generateListKey(selectAuthUserId(prev), queryTypes.USER_SHARES)
            ) &&
          selectUsersFromList(next, `${selectAuthUserId(next)}_Friends`) ===
            selectUsersFromList(prev, `${selectAuthUserId(prev)}_Friends`)
        );
      }
    }
  ),
  withShares
);
