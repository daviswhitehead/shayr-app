import _ from 'lodash';
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import withComments from '../../higherOrderComponents/withComments';
import withShares from '../../higherOrderComponents/withShares';
import Colors from '../../styles/Colors';
import Icon, { names } from '../Icon';
import styles from './styles';

interface StateProps {}

interface DispatchProps {}

interface OwnProps {
  hideBackdrop?: boolean;
  onModalWillHide?: () => void;
  onModalHide?: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface OwnState {
  isVisible: boolean;
  didCancel: boolean;
}

const mapDispatchToProps = {};

class DoneModal extends React.Component<Props, OwnState> {
  initialState: OwnState;
  shareText: string;
  share?: any;
  commentText: string;
  comment?: any;
  cancelText: string;
  cancel?: any;
  onHideFunction?: () => void;
  shareModalRef: any;

  constructor(props: Props) {
    super(props);

    this.initialState = {
      isVisible: false,
      didCancel: false
    };
    this.state = {
      ...this.initialState
    };

    this.shareText = 'Shayr with more friends';
    this.share = withShares(this.renderRow);
    this.commentText = 'Join the conversation';
    this.comment = withComments(this.renderRow);
    this.cancelText = "I'm all set";
    this.cancel = this.renderRow;
  }

  renderRow = ({
    onPress,
    type
  }: {
    onPress: () => void;
    type: 'share' | 'comment' | 'cancel';
  }) => {
    const iconNamesMap = {
      share: names.SHARE,
      comment: names.REACTION,
      cancel: names.X_EXIT
    };

    const textMap = {
      share: this.shareText,
      comment: this.commentText,
      cancel: this.cancelText
    };

    return (
      <TouchableOpacity style={styles.rowContainer} onPress={onPress}>
        <Icon name={iconNamesMap[type]} />
        <Text style={styles.button}>{textMap[type]}</Text>
      </TouchableOpacity>
    );
  };

  onModalWillShow = () => {};

  onModalWillHide = () => {
    if (this.props.onModalWillHide) {
      this.props.onModalWillHide();
    }
  };

  toggleModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  onBackdropPress = () => {
    this.setState({ isVisible: false, didCancel: true });
  };

  onModalHide = () => {
    if (this.props.onModalHide && !this.state.didCancel) {
      this.props.onModalHide();
    }
    this.setState(this.initialState);
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
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            Nice, you marked this post as done! Let your friends know what you
            think?
          </Text>
          {this.share && (
            <this.share
              {...this.props}
              type='share'
              onModalHide={this.toggleModal}
            />
          )}
          {this.comment && (
            <this.comment
              {...this.props}
              type='comment'
              onModalHide={this.toggleModal}
            />
          )}
          {this.cancel && (
            <this.cancel type='cancel' onPress={this.toggleModal} />
          )}
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
)(DoneModal);
