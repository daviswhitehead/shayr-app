import _ from 'lodash';
import { Error, GetDocumentsAction, types } from './actions';

interface InitialState {
  [documentId: string]: any;
  _error?: Error;
}

const initialState: InitialState = {};

function reducer(state = initialState, action: GetDocumentsAction) {
  switch (action.type) {
    case types.GET_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        ...action.documents
      };
    }
    case types.GET_DOCUMENTS_FAIL: {
      return {
        ...state,
        _error: action.error
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
