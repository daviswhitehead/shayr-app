import React, { Component } from 'react';
import {
  Button,
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { LoginButton, LoginManager } from 'react-native-fbsdk';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { loginFacebook, logoutFacebook } from '../../lib/FacebookRequests';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { loginWithFacebook } from '../../lib/FirebaseLogin';
import { facebookAuth, signOutUser } from '../../redux/auth/actions';
import { getPost } from '../../redux/posts/actions';
import { State } from '../../redux/Reducers';
import styles from './styles';

const VECTOR_LOGO = require('../../assets/images/VectorLogo.png');

interface StateProps {
  auth: any;
}

interface DispatchProps {
  facebookAuth: typeof facebookAuth;
  signOutUser: typeof signOutUser;
  getPost: typeof getPost;
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface OwnState {
  skipScreen: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: State) => ({
  auth: state.auth,
  posts: state.posts
});

const mapDispatchToProps = {
  facebookAuth,
  signOutUser,
  getPost
};

class Login extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  constructor(props: Props) {
    super(props);

    this.state = {
      skipScreen: this.props.auth.user.uid && this.props.auth.hasAccessToken
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

  render() {
    console.log(`Login - Render`);
    console.log('this.props');
    console.log(this.props);

    return (
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Image style={styles.image} source={VECTOR_LOGO} />
          <Text style={styles.brand}>Shayr</Text>
          <Text style={styles.tagline}>Discover Together</Text>
        </View>
        <View style={styles.loginContainer}>
          <Button
            title='Login'
            onPress={async () => {
              logEvent(AnalyticsDefinitions.category.ACTION, {
                [AnalyticsDefinitions.parameters.LABEL]:
                  AnalyticsDefinitions.label.FACEBOOK_LOGIN_BUTTON,
                [AnalyticsDefinitions.parameters.TYPE]:
                  AnalyticsDefinitions.type.PRESS
              });
              const result = await loginWithFacebook();
              if (result.isSuccessful) {
                console.log('SUCCESS');
              } else {
                console.log('NOT SUCCESSFUL');
              }
            }}
          />
          <Button
            title='Logout'
            onPress={() => {
              console.log('Logout');
              logoutFacebook();
            }}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
