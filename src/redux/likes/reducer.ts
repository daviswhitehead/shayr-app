import _ from 'lodash';
import documentsReducer from '../documents/reducer';
import { createNamedWrapperReducer } from '../ReducerHelpers';
import { types } from './actions';

const initialState = {
  hasUpdatedUser: false
};

const likesDocumentReducer = createNamedWrapperReducer(
  documentsReducer,
  'likes'
);

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.UPDATE_USER_LIKES_SUCCESS: {
      return {
        ...state,
        hasUpdatedUser: true
      };
    }
    default: {
      return likesDocumentReducer(state, action);
    }
  }
}

export default reducer;
