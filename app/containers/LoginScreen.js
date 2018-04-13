
import React, { Component } from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Button,
    ActivityIndicator,
    StatusBar,
    AsyncStorage
} from 'react-native';

// Components to display when the user is LoggedIn and LoggedOut
// Screens for logged in/out - outside the scope of this tutorial

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }
    /**
     * When the App component mounts, we listen for any authentication
     * state changes in Firebase.
     * Once subscribed, the 'user' parameter will either be null
     * (logged out) or an Object (logged in)
     */
    componentDidMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            this.setState({
                loading: false,
                user,
            });
        });
    }
    /**
     * Don't forget to stop listening for authentication state changes
     * when the component unmounts.
     */
    componentWillUnmount() {
        this.authSubscription();
    }

    render() {
        // The application is initialising
        if (this.state.loading) return null;
        // The user is an Object, so they're logged in
        if (this.state.user) return <LoggedIn navigation={this.props.navigation} user={this.props.user}/>;
        // The user is null, so they're logged out
        return <LoggedOut navigation={this.props.navigation}/>;
    }
}

class LoggedIn extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: 'SIGNIN'
        }
    }
    componentDidMount() {
        this.props.navigation.navigate('App');
    }
    render() {
        return <View />
    }
}


class LoggedOut extends React.Component {
    // Calling the following function will open the FB login dialogue:
    onLoginOrRegister = () => {
        LoginManager.logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                    return Promise.reject(new Error('The user cancelled the request'));
                }
                // Retrieve the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then((data) => {
                // Create a new Firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                // Login with the credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((user) => {
                // If you need to do anything with the user, do it here
                // The user will be logged in automatically by the
                // `onAuthStateChanged` listener we set up in App.js earlier
            })
            .catch((error) => {
                const { code, message } = error;
                // For details of error codes, see the docs
                // The message contains the default Firebase string
                // representation of the error
            });
    }

    render() {
        return (
            <View>
                <Button title="Login" onPress={this.onLoginOrRegister} />
            </View>
        );
    }

}
