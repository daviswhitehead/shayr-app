import _ from 'lodash';
import documentsReducer from '../documents/reducer';
import { createNamedWrapperReducer } from '../ReducerHelpers';
import { STATE_KEY, types } from './actions';

const initialState = {
  hasUpdatedUser: false
};

const donesDocumentReducer = createNamedWrapperReducer(
  documentsReducer,
  STATE_KEY
);

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.UPDATE_USER_DONES_SUCCESS: {
      return {
        ...state,
        hasUpdatedUser: true
      };
    }
    default: {
      return donesDocumentReducer(state, action);
    }
  }
}

export default reducer;
