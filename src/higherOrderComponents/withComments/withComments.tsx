import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CommentModal from '../../components/CommentModal';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { createComment } from '../../redux/comments/actions';
import { State } from '../../redux/Reducers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  friends?: {
    [userId: string]: User;
  };
}

interface DispatchProps {
  createComment: typeof createComment;
}

interface OwnProps {
  ownerUserId: string;
  postId: string;
  usersPostsComments: Array<string>;
}

type Props = OwnProps & StateProps & DispatchProps;

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

const mapDispatchToProps = {
  createComment
};

const withComments = (WrappedComponent: SFC) => {
  return class CommentEnabled extends React.Component<Props> {
    modalRef: any;

    constructor(props: Props) {
      super(props);

      this.modalRef = React.createRef();
    }

    onSubmit = (comment: string) => {
      this.props.createComment(
        this.props.postId,
        comment,
        this.props.authUserId,
        this.props.ownerUserId,
        undefined,
        _.keys(this.props.friends),
        undefined
      );
    };

    render() {
      const {
        authUserId,
        friends = [],
        ownerUserId,
        postId,
        usersPostsComments,
        ...passThroughProps
      } = this.props;

      const isActive = _.includes(usersPostsComments, authUserId);

      return (
        <View>
          <WrappedComponent
            isActive={isActive}
            onPress={() => this.modalRef.current.toggleModal()}
            {...passThroughProps}
          />
          <CommentModal
            ref={this.modalRef}
            onSubmit={this.onSubmit}
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
  withComments
);
