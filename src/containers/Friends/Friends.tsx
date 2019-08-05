import { getUserShortName } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import UserTextDate from '../../components/UserTextDate';
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
  }

  componentDidMount() {}

  render() {
    if (!this.props.authUser) {
      return <ActivityIndicator />;
    }

    // console.log(this.props.authUser);

    return (
      <View style={styles.container}>
        <Text>COMING SOON</Text>
        <Button onPress={this.props.startSignOut} title='Log Out' />
        <UserTextDate
          userName={getUserShortName(this.props.authUser)}
          profilePhoto={this.props.authUser.facebookProfilePhoto}
          // text='Bob S I want to be like him when I grow up...'
          text='Bob S finished with your shayr, My Undesireable Talent. Ask them how they liked it?'
          createdAt={new Date('December 17, 1995 03:24:00')}
          // createdAt={new Date()}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
