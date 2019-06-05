import { types } from './actions';

const initialState = {
  url: null,
  protocol: null,
  hostname: null,
  screen: null,
  params: {},
  error: null,
};

function routingReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error,
    };
  }

  // Case Handling
  switch (action.type) {
    case types.ROUTE_ADDED: {
      return {
        ...state,
        url: action.url,
        protocol: action.protocol,
        hostname: action.hostname,
        screen: action.screen,
        params: action.params,
      };
    }
    case types.ROUTE_REMOVED: {
      return {
        ...state,
        url: null,
        protocol: null,
        hostname: null,
        screen: null,
        params: {},
      };
    }
    default: {
      return state;
    }
  }
}

export default routingReducer;
