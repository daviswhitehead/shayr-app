import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ShareModal from '../../components/ShareModal';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { State } from '../../redux/Reducers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  friends: {
    [userId: string]: User;
  };
}

interface OwnProps {
  ownerUserId: string;
  postId: string;
  url: string;
  usersPostsId: string;
  usersPostsShares: Array<string>;
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

const withShares = (WrappedComponent: SFC) => {
  return class ShareEnabled extends React.Component<Props> {
    modalRef: any;

    constructor(props: Props) {
      super(props);

      this.modalRef = React.createRef();
    }

    render() {
      const {
        authUserId,
        friends,
        ownerUserId,
        postId,
        url,
        usersPostsId,
        usersPostsShares,
        ...passThroughProps
      } = this.props;

      const isSharesActive = _.includes(usersPostsShares, authUserId);

      return (
        <View>
          <WrappedComponent
            isActive={isSharesActive}
            onPress={() => this.modalRef.current.toggleModal()}
            {...passThroughProps}
          />
          <ShareModal
            ref={this.modalRef}
            authUserId={authUserId}
            ownerUserId={ownerUserId}
            payload={url}
            usersPostsId={usersPostsId}
            postId={postId}
            users={friends}
            {...passThroughProps}
          />
        </View>
      );
    }
  };
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
  withShares
);
