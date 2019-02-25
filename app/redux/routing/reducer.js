import { types } from './actions';

const initialState = {
  url: null,
  screen: null,
  params: {},
  eventType: null,
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
    case types.DEEP_LINK_LAUNCHED: {
      return {
        ...state,
        eventType: action.eventType,
      };
    }
    case types.ROUTE_ADDED: {
      return {
        ...state,
        url: action.url,
        screen: action.screen,
        params: action.params,
      };
    }
    case types.ROUTE_REMOVED: {
      return {
        ...state,
        url: null,
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
