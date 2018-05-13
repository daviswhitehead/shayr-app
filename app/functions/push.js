import firebase from 'react-native-firebase';

const ts = firebase.firestore.FieldValue.serverTimestamp();

const getUserId = (user) => {
  return user.uid;
}

export const saveUserInfo = (user, data) => {
  const ref = firebase.firestore().collection('users').doc(getUserId(user));
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          createdAt: ts,
          updatedAt: ts,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          facebookGender: data.gender,
          facebookAgeRange: data.age_range,
          facebookProfilePhoto: data.picture.data.url
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
