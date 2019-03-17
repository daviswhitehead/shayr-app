const _ = require('lodash');
const utility = require('./Utility');

exports.createPostAtom = (post, postId = false) => {
  return {
    ..._.omit(post, 'createdAt', 'updatedAt', 'id', 'ref'),
    postId: postId ? postId : post.id
  };
};

exports.createUserAtom = (user, userId = false) => {
  return {
    userId: userId ? userId : user.id,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userFacebookProfilePhoto: user.facebookProfilePhoto
  };
};
