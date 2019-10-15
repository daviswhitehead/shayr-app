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
      return currentAccessToken;
    }
  } catch (error) {
    console.error(error);
  }
  return;
};

export const logoutFacebook = () => {
  LoginManager.logOut();
};

export const getFacebookProfile = (accessToken: AccessToken) =>
  new Promise((resolve, reject) => {
    const responseCallback = (error, result) => {
      if (error) {
        console.error(`getFBProfile error: ${result.error}`);
        reject(error);
      } else {
        resolve(result);
      }
    };

    const profileRequestParams = {
      accessToken: accessToken.accessToken,
      parameters: {
        fields: {
          string: 'picture.type(large)'
        }
      }
    };

    const profileRequest = new GraphRequest(
      '/me',
      profileRequestParams,
      responseCallback
    );

    new GraphRequestManager().addRequest(profileRequest).start();
  });

// export const getFacebookEmail = async (accessToken: AccessToken) => {
//   try {
//     const responseCallback = (error, result) => {
//       if (error) {
//         throw new Error(result.error);
//       } else {
//         return result;
//       }
//     };

//     const profileRequest = new GraphRequest(
//       '/me',
//       {
//         accessToken: accessToken.accessToken,
//         parameters: {
//           fields: {
//             string: 'email'
//           }
//         }
//       },
//       responseCallback
//     );

//     new GraphRequestManager().addRequest(profileRequest).start();
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getFacebookEmail = (accessToken: AccessToken): Promise<string> =>
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
        accessToken: accessToken.accessToken,
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
