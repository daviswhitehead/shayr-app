import firebase from 'react-native-firebase';

export const ts = firebase.firestore.FieldValue.serverTimestamp();

export const getDocShares = doc => doc
  .collection('shares')
  .get()
  .then(query => query.docs)
  .catch((e) => {
    console.error(e);
    return false;
  });

export const getRefData = ref => ref
  .get()
  .then(doc => doc.data())
  .catch((e) => {
    console.error(e);
    return false;
  });

export const addPost = (user, postId) => {
  const ref = firebase
    .firestore()
    .collection('users')
    .doc(getUserId(user))
    .collection('postsMeta')
    .doc(postId);
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          addCreatedAt: ts,
          addUpdatedAt: ts,
          addVisible: true,
        });
      } else {
        ref.set(
          {
            addUpdatedAt: ts,
            addVisible: true,
          },
          {
            merge: true,
          },
        );
      }
      console.log('addPost success');
    })
    .catch((error) => {
      console.error(error);
    });
};

export const donePost = (user, postId) => {
  const ref = firebase
    .firestore()
    .collection('users')
    .doc(getUserId(user))
    .collection('postsMeta')
    .doc(postId);
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          doneCreatedAt: ts,
          doneUpdatedAt: ts,
          doneVisible: true,
          addUpdatedAt: ts,
          addVisible: false,
        });
      } else {
        ref.set(
          {
            doneUpdatedAt: ts,
            doneVisible: true,
            addUpdatedAt: ts,
            addVisible: false,
          },
          {
            merge: true,
          },
        );
      }
    })
    .then((ref) => {
      console.log('donePost success');
    })
    .catch((error) => {
      console.error(error);
    });
};

export const removeAddedPost = (user, postId) => {
  const ref = firebase
    .firestore()
    .collection('users')
    .doc(getUserId(user))
    .collection('postsMeta')
    .doc(postId);
  return ref
    .update({
      addUpdatedAt: ts,
      addVisible: false,
    })
    .then((ref) => {
      console.log('removeAddedPost success');
    })
    .catch((error) => {
      console.error(error);
    });
};

export const createShare = (ref, payload) => ref
  .collection('inboundShares')
  .add({
    createdAt: ts,
    updatedAt: ts,
    payload,
  })
  .then((ref) => {
    console.log('createShare success');
    return true;
  })
  .catch((error) => {
    console.error(error);
  });
