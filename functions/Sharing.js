const admin = require('firebase-admin');
const _ = require('lodash');

exports.createUserShare = (url) => {
  return {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    url: url
  }
}

exports.updateUserShareWithPost = (postRef) => {
  return {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    post: postRef
  }
}

exports.createPostShare = (url, userRef) => {
  return {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    url: url,
    user: userRef
  }
}

exports.createPost = (url) => {
  return {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    url: url
  }
}

exports.updatePostWithMeta = (postData, meta) => {
  // const handlePublisher = (postData, meta) => {
  //   if (postData.publisher) {
  //     return {
  //       name: postData.publisher.name || meta.publisher.name || '',
  //       logo: postData.publisher.logo || meta.publisher.logo || ''
  //     }
  //   }
  //   else if (meta.publisher) {
  //     return {
  //       name: meta.publisher.name || '',
  //       logo: meta.publisher.logo || ''
  //     }
  //   }
  //   else {
  //     return {
  //       name: '',
  //       logo: ''
  //     }
  //   }
  // }
  // const publisher = handlePublisher(postData, meta);

  // return {
  //   updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  //   title: postData.title || meta.title || '',
  //   publisher: publisher,
  //   description: postData.description || meta.description || '',
  //   image: postData.image || meta.image || '',
  //   medium: postData.medium || meta.medium || 'article'
  // }
  return {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    title: _.get(postData, 'title', '') || _.get(meta, 'title', ''),
    publisher: _.get(postData, 'publisher', '') || _.get(meta, 'publisher', ''),
    description: _.get(postData, 'description', '') || _.get(meta, 'description', ''),
    image: _.get(postData, 'image', '') || _.get(meta, 'image', ''),
    medium: _.get(postData, 'medium', '') || _.get(meta, 'medium', '')
  }
}
