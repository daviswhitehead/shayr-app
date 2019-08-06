import _ from 'lodash';
import createCachedSelector from 're-reselect';

const selectComments = (state) => state.comments;
const selectComment = (state, commentId) => state.comments[commentId];
const selectCommentsLists = (state, listKey) => state.commentsLists[listKey];

export const selectCommentsForPostDetail = createCachedSelector(
  selectComments,
  selectCommentsLists,
  (comments, commentsList) => {
    if (!comments || !_.get(commentsList, 'isLoaded', false)) {
      return;
    }

    return commentsList.items.reduce((result: any, commentId: string) => {
      return [
        ...result,
        {
          _key: commentId,
          ..._.get(comments, commentId, {})
        }
      ];
    }, []);
  }
)((state, listKey) => listKey);

export const selectCommentsMetadataForPostDetail = createCachedSelector(
  selectComments,
  selectCommentsLists,
  (comments, commentsList) => {
    if (!comments || !_.get(commentsList, 'isLoaded', false)) {
      return;
    }
    return { ..._.omit(commentsList, 'items') };
  }
)((state, listKey) => listKey);
