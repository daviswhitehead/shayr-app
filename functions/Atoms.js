const utility = require("./Utility");
const _ = require("lodash");

exports.createPostAtom = post => {
  return {
    ..._.omit(post, "createdAt", "updatedAt", "id", "ref"),
    post: `posts/${post.id}`
  };
};

exports.createUserAtom = user => {
  return {
    user: `users/${user.id}`,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userFacebookProfilePhoto: user.facebookProfilePhoto
  };
};
