import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

export const loginFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email'
    ]);
    if (result.isCancelled) {
      console.warn('Login was cancelled');
    } else {
      return getAccessToken();
    }
  } catch (error) {
    console.error(error);
  }
  return;
};

export const getAccessToken = async () => {
  try {
    const currentAccessToken = await AccessToken.getCurrentAccessToken();
    if (!currentAccessToken) {
      throw new Error('Something went wrong obtaining the users access token');
    } else {
      return currentAccessToken.accessToken;
    }
  } catch (error) {
    console.error(error);
  }
  return;
};

export const logoutFacebook = () => {
  LoginManager.logOut();
};

export const getFacebookEmail = (accessToken: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const responseCallback = (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.email);
      }
    };

    const profileRequest = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: {
          fields: {
            string: 'email'
          }
        }
      },
      responseCallback
    );

    new GraphRequestManager().addRequest(profileRequest).start();
  });
