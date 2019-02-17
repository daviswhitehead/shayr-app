import { AccessToken, LoginManager } from 'react-native-fbsdk';

export const getFBToken = (error, result) => {
  if (error) {
    console.error(`login has error: ${result.error}`);
  } else if (result.isCancelled) {
    console.log('login is cancelled.');
  } else {
    const tokenData = AccessToken.getCurrentAccessToken();
    if (!tokenData) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    return tokenData;
  }
  return null;
};

export const logoutFB = () => {
  LoginManager.logOut();
};
