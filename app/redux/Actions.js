import firebase from 'react-native-firebase';

// Authentication
export const authenticationActionTypes = {
  SIGN_IN_REQUEST: 'SIGN_IN_REQUEST',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE',

  SIGN_OUT_REQUEST: 'SIGN_OUT_REQUEST',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE: 'SIGN_OUT_FAILURE',

  SIGN_UP_REQUEST: 'SIGN_UP_REQUEST',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE: 'SIGN_UP_FAILURE',
}

export const authenticationActions = {
  SIGN_IN: () => {
    return { type: SIGN_IN }
  },
  SIGN_IN_REQUEST: () => (dispatch) => {
    dispatch({ type: SIGN_IN_REQUEST });

    firebase.auth().onAuthStateChanged((user) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          user: user,
        }
      });
    });
  },
  SIGN_OUT: () => {
    return { type: SIGN_OUT }
  },
  SIGN_UP: () => {
    return { type: SIGN_UP }
  },
}
