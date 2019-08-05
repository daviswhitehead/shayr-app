import _ from 'lodash';
import documentsReducer from '../documents/reducer';
import { createNamedWrapperReducer } from '../ReducerHelpers';
import { STATE_KEY, types } from './actions';

const initialState = {
  hasUpdatedUser: false
};

const addsDocumentReducer = createNamedWrapperReducer(
  documentsReducer,
  STATE_KEY
);

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.UPDATE_USER_ADDS_SUCCESS: {
      return {
        ...state,
        hasUpdatedUser: true
      };
    }
    default: {
      return addsDocumentReducer(state, action);
    }
  }
}

export default reducer;
