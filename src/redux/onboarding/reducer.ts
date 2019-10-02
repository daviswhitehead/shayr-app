import { Actions, items, types } from './actions';

export interface State {
  [items.DID_VIEW_INTRO]: boolean;
  [items.DID_VIEW_HOW_TO]: boolean;
  SHAYR_ONBOARDING_POST_ID: string;
}

export const initialState: State = {
  [items.DID_VIEW_INTRO]: false,
  [items.DID_VIEW_HOW_TO]: false,
  SHAYR_ONBOARDING_POST_ID: 'SHAYR_HOW_TO'
};

function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case types.GET_ONBOARDING_STATUS: {
      return {
        ...state,
        [items.DID_VIEW_INTRO]: action[items.DID_VIEW_INTRO],
        [items.DID_VIEW_HOW_TO]: action[items.DID_VIEW_HOW_TO]
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
