import { Actions, types } from './actions';

export interface State {
  url: string;
  protocol: string;
  hostname: string;
  screen: string;
  params: any;
}

const initialState = {
  url: '',
  protocol: '',
  hostname: '',
  screen: '',
  params: {}
};

function reducer(state: State = initialState, action: Actions) {
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
        url: '',
        protocol: '',
        hostname: '',
        screen: '',
        params: {}
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
