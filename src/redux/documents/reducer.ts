import _ from 'lodash';
import { Actions, Error, types } from './actions';

export interface State {
  [documentId: string]: any;
  _error?: Error;
}

const initialState: State = {};

function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case types.GET_DOCUMENTS_SUCCESS: {
      if (_.isEmpty(action.documents)) {
        return state;
      }

      return _.reduce(
        action.documents,
        (result, value, key) => {
          if (_.isEqual(result.key, value)) {
            return result;
          }
          return {
            ...result,
            [key]: value
          };
        },
        state
      );
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
