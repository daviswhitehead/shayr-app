import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import CommentModal from '../../components/CommentModal';
import Header from '../../components/Header';
import { startSignOut } from '../../redux/auth/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import colors from '../../styles/Colors';
import styles from './styles';

const mapStateToProps = (state) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    authUser: selectUserFromId(state, authUserId),
    friends: selectUsersFromList(state, `${authUserId}_Friends`),
    usersPosts: state.usersPosts
  };
};

const mapDispatchToProps = (dispatch) => ({
  startSignOut: () => dispatch(startSignOut())
});

class Friends extends Component {
  static propTypes = {
    startSignOut: PropTypes.func.isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired
  };

  static navigationOptions = () => ({
    header: (
      <Header
        backgroundColor={colors.WHITE}
        statusBarStyle='dark-content'
        title='Hello World'
      />
    )
  });

  constructor(props: Props) {
    super(props);
    this.modalRef = React.createRef();
  }

  componentDidMount() {}

  render() {
    if (!this.props.authUser) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <Text>COMING SOON</Text>
        <Button onPress={this.props.startSignOut} title='Log Out' />
        <Button
          onPress={() => this.modalRef.current.toggleModal()}
          title='Toggle Modal'
        />
        <CommentModal
          authUserId={this.props.authUserId}
          ownerUserId={this.props.authUserId}
          postId={'9JKOMIpbKdSCt4MRomPI'}
          ref={this.modalRef}
          visibleToUserIds={_.keys({
            [this.props.authUserId]: this.props.authUser,
            ...this.props.friends
          })}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
