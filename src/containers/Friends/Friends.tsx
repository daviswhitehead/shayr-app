import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import DoneModal from '../../components/DoneModal';
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

  modalRef: any;
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
        <DoneModal
          ref={this.modalRef}
          shareProps={undefined}
          commentProps={undefined}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
