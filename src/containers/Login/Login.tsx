import React, { Component } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import LoginButton from '../../components/LoginButton';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { loginWithFacebook, saveUser } from '../../lib/FirebaseLogin';
import { hasAccessToken, signOutUser } from '../../redux/auth/actions';
import { getPost } from '../../redux/posts/actions';
import { State } from '../../redux/Reducers';
import styles from './styles';

const VECTOR_LOGO = require('../../assets/images/VectorLogo.png');

interface StateProps {
  auth: any;
}

interface DispatchProps {
  hasAccessToken: typeof hasAccessToken;
  signOutUser: typeof signOutUser;
  getPost: typeof getPost;
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface OwnState {
  isLoading: boolean;
  didLogin: boolean;
  skipScreen: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: State) => ({
  auth: state.auth,
  posts: state.posts
});

const mapDispatchToProps = {
  hasAccessToken,
  signOutUser,
  getPost
};

class Login extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  constructor(props: Props) {
    super(props);

    this.state = {
      skipScreen: this.props.auth.user.uid && this.props.auth.hasAccessToken,
      isLoading: false,
      didLogin: false
    };

    if (this.props.auth.isSigningOut) {
      // when a user navigates to the login screen with isSigningOut === true, sign out the user
      this.props.signOutUser();
    } else if (this.state.skipScreen) {
      // when a user navigates to the login screen already authenticated (app launch), navigate to the app
      this.props.navigation.navigate('App');
    }
  }

  componentDidUpdate() {
    if (this.props.auth.user.uid && this.props.auth.hasAccessToken) {
      // navigate to the app after successful authentication
      this.props.navigation.navigate('App');
    }
  }

  onFacebookPress = () => {
    this.setState(
      {
        isLoading: true
      },
      async () => {
        logEvent(AnalyticsDefinitions.category.ACTION, {
          [AnalyticsDefinitions.parameters.LABEL]:
            AnalyticsDefinitions.label.FACEBOOK_LOGIN_BUTTON,
          [AnalyticsDefinitions.parameters.TYPE]:
            AnalyticsDefinitions.type.PRESS
        });
        logEvent(AnalyticsDefinitions.category.REQUEST, {
          [AnalyticsDefinitions.parameters.LABEL]:
            AnalyticsDefinitions.label.FACEBOOK_LOGIN,
          [AnalyticsDefinitions.parameters.STATUS]:
            AnalyticsDefinitions.status.START
        });
        const result = await loginWithFacebook();
        if (result.isSuccessful) {
          logEvent(AnalyticsDefinitions.category.REQUEST, {
            [AnalyticsDefinitions.parameters.LABEL]:
              AnalyticsDefinitions.label.FACEBOOK_LOGIN,
            [AnalyticsDefinitions.parameters.STATUS]:
              AnalyticsDefinitions.status.SUCCESS
          });
          saveUser(result.user);
          this.props.hasAccessToken();
        } else if (result.needsLink) {
          this.setState({
            isLoading: false
          });
        } else {
          logEvent(AnalyticsDefinitions.category.REQUEST, {
            [AnalyticsDefinitions.parameters.LABEL]:
              AnalyticsDefinitions.label.FACEBOOK_LOGIN,
            [AnalyticsDefinitions.parameters.STATUS]:
              AnalyticsDefinitions.status.FAIL
          });
          this.setState({
            isLoading: false
          });
        }
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Image style={styles.image} source={VECTOR_LOGO} />
          <Text style={styles.brand}>Shayr</Text>
          <Text style={styles.tagline}>Discover Together</Text>
        </View>
        <View style={styles.loginContainer}>
          {this.state.isLoading ? (
            <ActivityIndicator size='large' color='black' />
          ) : (
            <LoginButton type='facebook' onPress={this.onFacebookPress} />
          )}
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
