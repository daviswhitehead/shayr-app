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
  post?: UsersPosts;
  users?: Users;
}

export interface State {
  isVisible: boolean;
  isCommenting: boolean;
  commentText: string;
  textInputHeight: number;
  selectedUsers: Array<documentId>;
  selectedAllUsers: boolean;
}

export default class SwipeCard extends React.Component<Props, State> {
  textInputRef: any;
  initialState: State;

  constructor(props: Props) {
    super(props);

    this.initialState = {
      // isVisible: true,
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
                post={this.props.post}
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
                  onChangeText={text => this.setState({ commentText: text })}
                  onBlur={() => this.handleBlur()}
                  // returnKeyType='done'
                  // blurOnSubmit
                  multiline
                  onContentSizeChange={event => {
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
