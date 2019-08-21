import _ from 'lodash';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { createComment } from '../../redux/comments/actions';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';
import Icon, { names } from '../Icon';
import styles from './styles';

interface StateProps {}

interface DispatchProps {
  createComment: typeof createComment;
}

interface OwnProps {
  authUserId: string;
  hideBackdrop?: boolean;
  onModalWillHide?: () => void;
  ownerUserId: string;
  postId: string;
  ref: any;
  visibleToUserIds: Array<string>;
}

type Props = OwnProps & StateProps & DispatchProps;

interface OwnState {
  isVisible: boolean;
  isCommenting: boolean;
  commentText: string;
  textInputHeight: number;
}

const mapDispatchToProps = {
  createComment
};

class CommentModal extends React.Component<Props, OwnState> {
  textInputRef: any;
  initialState: OwnState;
  maxTextInputHeight: number;
  placeholderText: string;

  constructor(props: Props) {
    super(props);

    this.initialState = {
      isVisible: false,
      isCommenting: false,
      commentText: '',
      textInputHeight: 0
    };
    this.state = {
      ...this.initialState
    };

    this.placeholderText = 'Join the conversation';
    this.maxTextInputHeight = 200;
    this.textInputRef = React.createRef();
  }

  onModalWillShow = () => {
    this.textInputRef && this.textInputRef.current.focus();
  };

  onModalWillHide = () => {
    if (this.props.onModalWillHide) {
      this.props.onModalWillHide();
    }
    this.setState(this.initialState);
  };

  componentDidUpdate(prevProps: Props) {}

  toggleModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  handleBlur = () => {
    // reset to comment button if comment has no non-whitespace characters
    if (!/\S+/.test(this.state.commentText)) {
      this.setState({
        isCommenting: false,
        commentText: ''
      });
    }
  };

  onBackdropPress = () => {
    this.setState({ isVisible: false });
  };

  onModalHide = () => {};

  onChangeText = (text: string) => this.setState({ commentText: text });

  onContentSizeChange = (event: any) => {
    this.setState({
      textInputHeight: Math.min(
        event.nativeEvent.contentSize.height,
        this.maxTextInputHeight
      )
    });
  };

  onFocus = () => {
    this.setState({ isCommenting: true });
  };

  onSubmit = () => {
    if (!!this.state.commentText) {
      this.toggleModal();
      this.props.createComment(
        this.props.postId,
        this.state.commentText,
        this.props.authUserId,
        this.props.ownerUserId,
        undefined,
        this.props.visibleToUserIds,
        undefined
      );
    }
    return;
  };

  render() {
    return (
      <Modal
        style={styles.modal}
        isVisible={this.state.isVisible}
        onModalWillShow={this.onModalWillShow}
        onModalWillHide={this.onModalWillHide}
        onBackdropPress={this.onBackdropPress}
        backdropColor={Colors.LIGHT_GRAY}
        backdropOpacity={this.props.hideBackdrop ? 0 : 0.3}
        supportedOrientations={['portrait']}
        propagateSwipe
        hideModalContentWhileAnimating
        backdropTransitionOutTiming={0}
        onModalHide={this.onModalHide}
        avoidKeyboard
      >
        <View
          style={[
            styles.container,
            this.state.isCommenting
              ? { paddingBottom: Layout.SPACING_LONG }
              : {}
          ]}
        >
          <View style={styles.rowContainer}>
            <TextInput
              ref={this.textInputRef}
              style={[
                styles.commentInput,
                { height: this.state.textInputHeight }
              ]}
              placeholder={this.placeholderText}
              placeholderTextColor={Colors.DARK_GRAY}
              value={this.state.commentText}
              onChangeText={this.onChangeText}
              onBlur={this.handleBlur}
              onFocus={this.onFocus}
              multiline
              onContentSizeChange={this.onContentSizeChange}
            />
            <Icon
              name={
                !!this.state.commentText
                  ? names.REACTION_ACTIVE
                  : names.REACTION
              }
              isActive={!!this.state.commentText}
              style={styles.iconContainer}
              onPress={this.onSubmit}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps,
  undefined,
  {
    forwardRef: true,
    areStatePropsEqual: (next, prev) => {
      return _.isEqual(next, prev);
    }
  }
)(CommentModal);
