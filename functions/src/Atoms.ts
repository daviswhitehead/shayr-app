import * as _ from 'lodash';

export const createPostAtom = (post: any, postId: any = false) => ({
  ..._.omit(post, 'createdAt', 'updatedAt', 'id', 'ref'),
  postId: postId || post.id,
});

export const createUserAtom = (user: any, userId: any = false) => ({
  userId: userId || user.id,
  userFirstName: user.firstName,
  userLastName: user.lastName,
  userFacebookProfilePhoto: user.facebookProfilePhoto,
});
