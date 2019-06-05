import {
  AccessToken, LoginManager, GraphRequest, GraphRequestManager,
} from 'react-native-fbsdk';

export const getFBToken = (error, result) => {
  if (error) {
    console.error(`getFBToken error: ${result.error}`);
  } else if (result.isCancelled) {
    console.log('login is cancelled.');
  } else {
    const currentAccessToken = AccessToken.getCurrentAccessToken();
    if (!currentAccessToken) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    return currentAccessToken;
  }
  return null;
};

export const logoutFB = () => {
  LoginManager.logOut();
};

export const getFBProfile = accessToken => new Promise((resolve, reject) => {
  const responseCallback = (error, result) => {
    if (error) {
      console.error(`getFBProfile error: ${result.error}`);
      reject(error);
    } else {
      resolve(result);
    }
  };

  const profileRequestParams = {
    accessToken,
    parameters: {
      fields: {
        string: 'picture.type(large)',
      },
    },
  };

  const profileRequest = new GraphRequest('/me', profileRequestParams, responseCallback);

  new GraphRequestManager().addRequest(profileRequest).start();
});
