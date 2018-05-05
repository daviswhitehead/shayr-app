import firebase from 'react-native-firebase';

const ts = firebase.firestore.FieldValue.serverTimestamp();

const getUserId = (user) => {
  return user.uid;
}

export const saveUserInfo = (user) => {
  const ref = firebase.firestore().collection('users').doc(getUserId(user));
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        const profile = user.additionalUserInfo.profile
        ref.set({
          createdAt: ts,
          updatedAt: ts,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          facebookGender: profile.gender,
          facebookAgeRange: profile.age_range,
          facebookProfilePhoto: profile.picture.data.url
        })
      } else {
        ref.set({
          updatedAt: ts,
        }, {
          merge: true
        })
      }
      console.log('saveUserInfo success');
    })
    .catch((error) => {
      console.error(error);
    });
}


export const createShare = (ref, url) => {
  return ref.collection('shares')
    .add({
      createdAt: ts,
      updatedAt: ts,
      url: url
    })
    .then((ref) => {
      console.log('createShare success');
      return true
    })
    .catch((error) => {
      console.error(error);
    });
}

export const savePostToUser = (user, postId) => {
  const ref = firebase.firestore().collection('users').doc(getUserId(user))
    .collection('savedPosts').doc(postId)
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          createdAt: ts,
          updatedAt: ts,
          doneAt: null,
          deletedAt: null
        })
      } else {
        ref.set({
          updatedAt: ts,
          doneAt: null,
          deletedAt: null
        }, {
          merge: true
        })
      }
      console.log('savePostToUser success');
    })
    .catch((error) => {
      console.error(error);
    });
}

export const markSavedPostAsDone = (user, postId) => {
  return firebase.firestore().collection('users').doc(getUserId(user))
    .collection('savedPosts').doc(postId)
    .update({
      doneAt: ts,
      updatedAt: ts
    })
    .then((ref) => {
      console.log('markSavedPostAsDone success');
    })
    .catch((error) => {
      console.error(error);
    });
}

export const deleteSavedPost = (user, postId) => {
  return firebase.firestore().collection('users').doc(getUserId(user))
    .collection('savedPosts').doc(postId)
    .update({
      deletedAt: ts,
      updatedAt: ts
    })
    .then((ref) => {
      console.log('deleteSavedPost success');
    })
    .catch((error) => {
      console.error(error);
    });
}
