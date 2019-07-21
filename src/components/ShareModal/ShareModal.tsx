import { documentId, User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { getPost } from '../../redux/posts/actions';
import {
  startSharePost,
  subscribeToNewShare
} from '../../redux/shares/actions';
import Colors from '../../styles/Colors';
import Icon from '../Icon';
import PostCard from '../PostCard';
import UserAvatar from '../UserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

export interface Props {
  authUserId: documentId;
  payload: string;
  post?: UsersPosts;
  postId?: documentId;
  url?: string;
  users?: Users;
  startSharePost: (
    payload: string,
    userId: documentId,
    postId: documentId,
    url: string
  ) => string;
  subscribeToNewShare: (shareId: documentId) => () => void;
}

export interface State {
  shareId: documentId;
  isVisible: boolean;
  isCommenting: boolean;
  commentText: string;
  textInputHeight: number;
  selectedUsers: Array<documentId>;
  selectedAllUsers: boolean;
}

const mapStateToProps = (state: any) => {
  return {
    shares: state.shares,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch: any, props: Props) => {
  return {
    startSharePost: (
      payload: string,
      userId: documentId,
      postId: documentId = '',
      url: string = ''
    ) => dispatch(startSharePost(payload, userId, postId, url)),
    subscribeToNewShare: (shareId: documentId) =>
      dispatch(subscribeToNewShare(shareId)),
    getPost: (postId: documentId) => dispatch(getPost(postId))
  };
};

class ShareModal extends React.Component<Props, State> {
  textInputRef: any;
  initialState: State;
  subscriptions: Array<() => void>;

  constructor(props: Props) {
    super(props);

    this.initialState = {
      shareId: '',
      isVisible: false,
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

  async componentDidMount() {
    // create a new share
    const shareId: documentId = await this.props.startSharePost(
      this.props.payload,
      this.props.authUserId,
      this.props.postId || '',
      this.props.url || ''
    );
    this.setState({ shareId });

    if (!this.props.post) {
      this.subscriptions.push(
        // subscribe to updates to the new share (from the scraper)
        await this.props.subscribeToNewShare(shareId)
      );
    }
  }

  componentDidUpdate(prevProps) {
    const shareId = this.state.shareId;
    const postId = _.get(this.props, ['shares', shareId, 'postId'], '');

    // when the new share is assigned a postId
    if (
      !this.props.post &&
      !_.isEmpty(postId) &&
      postId !== _.get(prevProps, ['shares', shareId, 'postId'], '')
    ) {
      // get the post data
      this.props.getPost(postId);
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
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

  render() {
    const {} = this.state;
    const {} = this.props;

    return (
      <Modal
        style={styles.modal}
        isVisible={this.state.isVisible}
        onBackdropPress={() => this.setState({ isVisible: false })}
        backdropColor={Colors.LIGHT_GRAY}
        backdropOpacity={0.3}
        supportedOrientations={['portrait']}
        propagateSwipe
        hideModalContentWhileAnimating
        backdropTransitionOutTiming={0}
        onModalHide={() => this.setState(this.initialState)}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContainer}
              showsVerticalScrollIndicator={false}
              overScrollMode='always'
            >
              <PostCard
                post={
                  this.props.post ||
                  this.props.posts[
                    _.get(
                      this.props,
                      ['shares', this.state.shareId, 'postId'],
                      ''
                    )
                  ]
                }
                ownerUserId={this.props.authUserId}
                onCardPress={undefined}
                noTouching
              />
              <View style={styles.separator} />
              {this.state.isCommenting ? (
                <TextInput
                  ref={this.textInputRef}
                  style={[
                    styles.commentInput,
                    { height: this.state.textInputHeight }
                  ]}
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
              ) : (
                <TouchableOpacity
                  style={[styles.commentButton]}
                  onPress={this.initiateCommenting}
                >
                  <Icon.default name={'reaction'} />
                  <Text style={styles.button}>Write a comment</Text>
                </TouchableOpacity>
              )}
              <View style={styles.separator} />
              <View style={styles.friendsContainer}>
                <Text style={styles.button}>Shayr with your friends...</Text>
                {/* <TouchableOpacity style={styles.touchableRow}>
                  <Icon.default
                    name={'invite'}
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
                  <Icon.default
                    name={
                      this.state.selectedAllUsers ? 'friends-active' : 'friends'
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
            </ScrollView>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.shareButtonContainer]}
              onPress={this.toggleModal}
            >
              <Icon.default name={'share'} />
              <Text style={styles.button}>Shayr</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.toggleModal}
          >
            <Icon.default name={'x-exit'} />
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
  { forwardRef: true }
)(ShareModal);
