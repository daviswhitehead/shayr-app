import {
  documentId,
  documentIds,
  Post,
  ShareAction,
  User,
  UsersPosts
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { selectDocumentFromId } from '../../redux/documents/selectors';
import { getPost } from '../../redux/posts/actions';
import {
  confirmShare,
  startShare,
  subscribeToShare
} from '../../redux/shares/actions';
import { getUsersPostsDocument } from '../../redux/usersPosts/actions';
import Colors from '../../styles/Colors';
import Icon, { names } from '../Icon';
import PostCard from '../PostCard';
import UserAvatar from '../UserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

interface StateProps {
  post: Post;
  posts: {
    [documentId: string]: Post;
  };
  shares: {
    [documentId: string]: ShareAction;
  };
  usersPost: UsersPosts;
}

interface DispatchProps {
  startShare: typeof startShare;
  confirmShare: typeof confirmShare;
  subscribeToShare: typeof subscribeToShare;
  getPost: typeof getPost;
  getUsersPostsDocument: typeof getUsersPostsDocument;
}

interface OwnProps {
  ref: any;
  authUserId: documentId;
  ownerUserId: documentId;
  payload: string;
  usersPostsId?: documentId;
  postId?: documentId;
  url?: string;
  users?: Users;
  navigateToLogin?: () => void;
  onModalWillHide?: () => void;
  onModalHide?: () => void;
  hideBackdrop?: boolean;
  isLoading?: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

interface OwnState {
  shareId: documentId;
  postId?: documentId;
  isVisible: boolean;
  isError: boolean;
  isCommenting: boolean;
  commentText: string;
  textInputHeight: number;
  selectedUsers: documentIds;
  selectedAllUsers: boolean;
  post?: Post | UsersPosts;
}

const mapStateToProps = (state: any, props: OwnProps) => {
  return {
    post: selectDocumentFromId(state, 'posts', props.postId),
    posts: state.posts,
    shares: state.shares,
    usersPost: selectDocumentFromId(state, 'usersPosts', props.usersPostsId)
  };
};

const mapDispatchToProps = {
  startShare,
  confirmShare,
  subscribeToShare,
  getPost,
  getUsersPostsDocument
};

class ShareModal extends React.Component<Props, OwnState> {
  textInputRef: any;
  initialState: OwnState;
  subscriptions: Array<() => void>;

  constructor(props: Props) {
    super(props);

    this.initialState = {
      shareId: '',
      postId: this.props.postId,
      isVisible: false,
      isError: false,
      isCommenting: false,
      commentText: '',
      textInputHeight: 0,
      selectedUsers: [],
      selectedAllUsers: false
    };
    this.state = {
      ...this.initialState
    };

    this.textInputRef = React.createRef();
    this.subscriptions = [];
  }

  onModalWillShow = async () => {
    // prevent database activity if there's no auth user
    if (!this.props.authUserId) {
      return;
    }

    // create a new share
    const shareId: documentId = await this.props.startShare(
      this.props.payload,
      this.props.authUserId,
      this.props.postId || ''
    );
    this.setState({ shareId });

    if (!this.props.postId || !this.props.usersPostsId) {
      this.subscriptions.push(
        // subscribe to updates to the new share (from the scraper)
        this.props.subscribeToShare(shareId)
      );
    } else {
      this.props.getPost(this.props.postId);
      this.props.getUsersPostsDocument(
        this.props.ownerUserId,
        this.props.usersPostsId
      );
    }

    // trigger an error in 15 sec if there's no post
    setTimeout(() => {
      if (!this.state.shareId || !this.state.post) {
        this.setState({ isError: true });
      }
    }, 15000);
  };

  onModalWillHide = () => {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
    if (this.props.onModalWillHide) {
      this.props.onModalWillHide();
    }
    this.setState(this.initialState);
  };

  componentDidUpdate(prevProps: Props) {
    const shareId = this.state.shareId;
    const postId =
      this.props.postId ||
      _.get(this.props, ['shares', shareId, 'postId'], undefined);
    const post =
      this.props.post ||
      this.props.usersPost ||
      _.get(this.props, ['posts', postId], undefined);

    // when the new share is assigned a postId
    if (
      !this.props.postId &&
      postId &&
      postId !== _.get(prevProps, ['shares', shareId, 'postId'], undefined)
    ) {
      // get the post data
      this.props.getPost(postId);
      this.setState({ postId, isError: false });
    }
    // when the post loads
    if (!this.state.post && post) {
      this.setState({ post });
    }
  }

  toggleModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  initiateCommenting = () => {
    this.setState({ isCommenting: !this.state.isCommenting }, () => {
      this.textInputRef.current.focus();
    });
  };

  handleBlur = () => {
    // reset to comment button if comment has no non-whitespace characters
    if (!/\S+/.test(this.state.commentText)) {
      this.setState({
        isCommenting: !this.state.isCommenting,
        commentText: ''
      });
    }
  };

  toggleSelectedUser = (userId: documentId) => {
    if (_.includes(this.state.selectedUsers, userId)) {
      this.setState({
        selectedUsers: _.pull(this.state.selectedUsers, userId),
        selectedAllUsers: false
      });
    } else {
      this.setState({
        selectedUsers: _.union(this.state.selectedUsers, [userId]),
        selectedAllUsers: false
      });
    }
  };

  toggleSelectedAllUsers = () => {
    this.setState({
      selectedAllUsers: !this.state.selectedAllUsers,
      selectedUsers: []
    });
  };

  renderUsersList = () => {
    return (
      <View style={styles.friendsContainer}>
        <Text style={styles.sectionHeader}>Shayr with your friends...</Text>
        {/* <TouchableOpacity style={styles.touchableRow}>
          <Icon
            name={names.INVITE}
            style={styles.iconStyle}
            iconStyle={styles.iconStyle}
          />
          <Text style={styles.friendsRowText}>
            Invite your friends to Shayr!
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.touchableRow}
          onPress={() => this.toggleSelectedAllUsers()}
        >
          <Icon
            name={
              this.state.selectedAllUsers ? names.FRIENDS_ACTIVE : names.FRIENDS
            }
            style={styles.iconStyle}
            iconStyle={styles.iconStyle}
            isActive={this.state.selectedAllUsers}
          />
          <Text
            style={[
              styles.friendsRowText,
              this.state.selectedAllUsers ? styles.selected : {}
            ]}
          >
            Shayr this with everyone!
          </Text>
        </TouchableOpacity>
        {_.reduce(
          this.props.users,
          (result: Array<JSX.Element>, value: any, key: string) => {
            result.push(
              <View style={styles.touchableRow} key={key}>
                <UserAvatar
                  {...value}
                  isVertical={false}
                  isSelected={
                    _.includes(this.state.selectedUsers, key) &&
                    !this.state.selectedAllUsers
                  }
                  onPress={() => this.toggleSelectedUser(key)}
                />
              </View>
            );
            return result;
          },
          []
        )}
      </View>
    );
  };

  renderComment = () => {
    if (this.state.isCommenting) {
      return (
        <TextInput
          ref={this.textInputRef}
          style={[styles.commentInput, { height: this.state.textInputHeight }]}
          value={this.state.commentText}
          onChangeText={(text) => this.setState({ commentText: text })}
          onBlur={() => this.handleBlur()}
          // returnKeyType='done'
          // blurOnSubmit
          multiline
          onContentSizeChange={(event) => {
            this.setState({
              textInputHeight: event.nativeEvent.contentSize.height
            });
          }}
        />
      );
    }
    return (
      <TouchableOpacity
        style={[styles.commentButton]}
        onPress={this.initiateCommenting}
      >
        <Icon name={names.REACTION} />
        <Text style={styles.button}>Write a comment</Text>
      </TouchableOpacity>
    );
  };

  renderLoading = () => {
    return (
      <View style={styles.otherContainer}>
        <ActivityIndicator size='large' color={Colors.BLACK} />
      </View>
    );
  };

  renderError = () => {
    return (
      <View style={styles.otherContainer}>
        <Text style={[styles.sectionHeader, styles.centerAlign]}>
          Oh no! Something went wrong :)
        </Text>
        <Text style={[styles.otherText, styles.centerAlign]}>
          We weren’t able to process your shayr, sorry about that! Try again
          later or drop us a line at shayr@gmail.com.
        </Text>
      </View>
    );
  };

  renderMissingAuth = () => {
    return (
      <View style={styles.otherContainer}>
        <Text style={[styles.sectionHeader, styles.centerAlign]}>
          Tell us who you are!
        </Text>
        <Text style={[styles.otherText, styles.centerAlign]}>
          Please login to Shayr, then come back and try again!
        </Text>
      </View>
    );
  };

  renderCallToAction = () => {
    if (
      (this.props.isLoading || this.state.isError || !this.state.postId) &&
      this.props.authUserId
    ) {
      return null;
    }

    // share the post
    let onPress = () => {
      this.props.confirmShare(
        this.props.authUserId,
        this.state.postId,
        this.state.shareId,
        this.state.commentText,
        this.state.selectedAllUsers
          ? _.keys(this.props.users)
          : this.state.selectedUsers,
        this.props.ownerUserId || '',
        _.keys(this.props.users),
        _.keys(this.props.users)
      );
      this.toggleModal();
    };
    // navigate to login
    if (!this.props.authUserId && this.props.navigateToLogin) {
      onPress = () => this.props.navigateToLogin();
    }

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.shareButtonContainer]}
        onPress={onPress}
      >
        <Icon name={names.SHARE} />
        <Text style={styles.button}>
          {this.props.authUserId ? 'Shayr' : 'Login'}
        </Text>
      </TouchableOpacity>
    );
  };

  renderContent = () => {
    if (!this.props.authUserId) {
      return this.renderMissingAuth();
    }
    if (this.state.isError) {
      return this.renderError();
    }
    if (this.props.isLoading) {
      return <View style={styles.otherContainer}>{this.renderLoading()}</View>;
    }

    return (
      <View>
        <View style={styles.separator} />
        {this.renderComment()}
        <View style={styles.separator} />
        {this.renderUsersList()}
      </View>
    );
  };

  onModalHide = () => {
    if (this.props.onModalHide) {
      this.props.onModalHide();
    }
  };

  render() {
    const { post } = this.state;

    return (
      <Modal
        style={styles.modal}
        isVisible={this.state.isVisible}
        onModalWillShow={this.onModalWillShow}
        onModalWillHide={this.onModalWillHide}
        onBackdropPress={() => this.setState({ isVisible: false })}
        backdropColor={Colors.LIGHT_GRAY}
        backdropOpacity={this.props.hideBackdrop ? 0 : 0.3}
        supportedOrientations={['portrait']}
        propagateSwipe
        hideModalContentWhileAnimating
        backdropTransitionOutTiming={0}
        onModalHide={this.onModalHide}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.contentContainer,
              this.props.isLoading ||
              this.state.isError ||
              !this.props.authUserId
                ? { flex: 0 }
                : { flex: 1 }
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.scrollViewContainer}
              showsVerticalScrollIndicator={false}
              overScrollMode='always'
            >
              <PostCard
                isLoading={!post}
                post={post}
                ownerUserId={this.props.authUserId}
                onCardPress={undefined}
                noTouching
              />
              {this.renderContent()}
            </ScrollView>
            {this.renderCallToAction()}
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.toggleModal}
          >
            <Icon name={names.X_EXIT} />
            <Text style={styles.button}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
    areStatePropsEqual: (next, prev) => {
      return _.isEqual(next, prev);
    }
  }
)(ShareModal);
