import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ShareModal from '../../components/ShareModal';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectDocumentFromId } from '../../redux/documents/selectors';
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
  usersPosts: UsersPosts;
}

interface OwnProps {
  ownerUserId: string;
  usersPostsId: string;
  postId: string;
  url: string;
}

type Props = OwnProps & StateProps;

const mapStateToProps = (state: State, props: OwnProps) => {
  return {
    authUserId: selectAuthUserId(state),
    friends: selectUsersFromList(
      state,
      `${selectAuthUserId(state)}_Friends`,
      true
    ),
    usersPosts: selectDocumentFromId(state, 'usersPosts', props.usersPostsId)
  };
};

const withShares = (WrappedComponent: SFC) => (props: Props) => {
  const {
    authUserId,
    authShares,
    friends,
    ownerUserId,
    usersPosts,
    usersPostsId,
    postId,
    url,
    ...passThroughProps
  } = props;

  const isSharesActive = _.includes(
    _.get(usersPosts, ['shares'], []),
    authUserId
  );
  const modalRef = React.useRef();

  return (
    <View>
      <WrappedComponent
        isActive={isSharesActive}
        onPress={modalRef ? () => modalRef.current.toggleModal() : null}
        {...passThroughProps}
      />
      <ShareModal
        ref={modalRef}
        authUserId={authUserId}
        ownerUserId={ownerUserId}
        payload={url}
        usersPostsId={usersPostsId}
        postId={postId}
        users={friends}
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
        // console.log('next');
        // console.log(next);
        // console.log('prev');
        // console.log(prev);
        // console.log('_.isEqual(next, prev)');
        // console.log(_.isEqual(next, prev));
        return _.isEqual(next, prev);
      },
      areStatePropsEqual: (next, prev) => {
        // console.log('next');
        // console.log(next);
        // console.log('prev');
        // console.log(prev);
        // console.log('_.isEqual(next, prev)');
        // console.log(_.isEqual(next, prev));
        return _.isEqual(next, prev);
      }
      // areStatesEqual: (next, prev) => {
      //   return (
      //     selectAuthUserId(next) === selectAuthUserId(prev) &&
      //     selectListItems(
      //       next,
      //       'sharesLists',
      //       generateListKey(selectAuthUserId(next), queryTypes.USER_SHARES)
      //     ) ===
      //       selectListItems(
      //         prev,
      //         'sharesLists',
      //         generateListKey(selectAuthUserId(prev), queryTypes.USER_SHARES)
      //       ) &&
      //     selectUsersFromList(next, `${selectAuthUserId(next)}_Friends`) ===
      //       selectUsersFromList(prev, `${selectAuthUserId(prev)}_Friends`)
      //   );
      // }
    }
  ),
  withShares
);
