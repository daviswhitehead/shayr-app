import firebase from 'react-native-firebase';

export const createShare = (ref, url) => {
  const ts = firebase.firestore.FieldValue.serverTimestamp();
  return ref.doc("testUser").collection('shares')
    .add({
      createdAt: ts,
      updatedAt: ts,
      url: url
    })
    .then((ref) => {
      console.log("Document successfully written!");
      return ref
    })
    .catch((error) => {
      console.error(error);
      return false
    });
}

export const savePostToUser = (userId, postId) => {
  console.log(userId);
  console.log(postId);
  const ts = firebase.firestore.FieldValue.serverTimestamp();
  return firebase.firestore().collection('users').doc(userId)
    .collection('savedPosts').doc(postId)
    .set({
      createdAt: ts,
      updatedAt: ts,
      doneAt: null,
      deletedAt: null
    })
    .then((ref) => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error(error);
    });
}
