import * as _ from 'lodash';
import { getDocumentsInCollection, returnBatch } from './Utility';
import { createPostAtom } from './Atoms';

// onWritePost({before: {}, after: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}}, {params: {postId: "yDZVi7G4U5yThribDE7G"}})
// onWritePost({before: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}, after: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, shareCount: 10, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}}, {params: {postId: "yDZVi7G4U5yThribDE7G"}})

export const _onWritePost = async (db: any, change: any, context: any) => {
  // posts/{postId}
  // write Post updates to matching Posts in all user_posts
  const postId = context.params.postId;
  const postAtom = createPostAtom(change.after.data(), postId);

  // get all matching Posts in users_posts
  const users_posts = await getDocumentsInCollection(
    db.collection('users_posts').where('postId', '==', postId),
    'users_posts',
  );

  // for each, write update
  const batch = db.batch();

  for (const user_postId in users_posts) {
    if (users_posts.hasOwnProperty(user_postId)) {
      batch.set(db.doc(users_posts[user_postId].ref), postAtom, {
        merge: true,
      });
    }
  }

  return returnBatch(batch);
};
