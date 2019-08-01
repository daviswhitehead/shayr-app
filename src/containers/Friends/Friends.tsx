import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import IconWithCount from '../../components/IconWithCount';
import PostCard from '../../components/PostCard';
import ShareModal from '../../components/ShareModal';
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
    const url = _.get(
      this.props.usersPosts,
      ['m592UXpes3azls6LnhN2VOf2PyT2_48PKLyY71DHin1XuIPop', 'url'],
      ''
    );
    if (_.isEmpty(url)) {
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
        <ShareModal
          ref={this.modalRef}
          payload={_.get(
            this.props.usersPosts,
            ['m592UXpes3azls6LnhN2VOf2PyT2_48PKLyY71DHin1XuIPop', 'url'],
            ''
          )}
          authUserId={this.props.authUserId}
          users={this.props.friends}
          // url={_.get(
          //   this.props.usersPosts,
          //   ['m592UXpes3azls6LnhN2VOf2PyT2_48PKLyY71DHin1XuIPop', 'url'],
          //   '',
          // )}
          // postId={_.get(
          //   this.props.usersPosts,
          //   ['m592UXpes3azls6LnhN2VOf2PyT2_48PKLyY71DHin1XuIPop', 'postId'],
          //   '',
          // )}
          // post={_.get(
          //   this.props.usersPosts,
          //   ['m592UXpes3azls6LnhN2VOf2PyT2_48PKLyY71DHin1XuIPop'],
          //   {}
          // )}
          // ownerUserId={this.props.ownerUserId}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
