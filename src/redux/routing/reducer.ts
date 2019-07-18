import { types } from './actions';

const initialState = {
  url: null,
  protocol: null,
  hostname: null,
  screen: null,
  params: {}
};

function routingReducer(state = initialState, action) {
  switch (action.type) {
    case types.ROUTE_ADDED: {
      return {
        ...state,
        url: action.url,
        protocol: action.protocol,
        hostname: action.hostname,
        screen: action.screen,
        params: action.params
      };
    }
    case types.ROUTE_REMOVED: {
      return {
        ...state,
        url: null,
        protocol: null,
        hostname: null,
        screen: null,
        params: {}
      };
    }
    default: {
      return state;
    }
  }
}

export default routingReducer;
