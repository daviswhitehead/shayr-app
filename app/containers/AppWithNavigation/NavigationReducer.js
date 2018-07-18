import { NavigationActions } from 'react-navigation';
import { RootNavigator } from '../../config/Routes';
import { types } from '../Login/AuthenticationActions';

const firstAction = RootNavigator.router.getActionForPathAndParams('Feed');
const tempNavState = RootNavigator.router.getStateForAction(firstAction);
const secondAction = RootNavigator.router.getActionForPathAndParams('Login');
const initialState = RootNavigator.router.getStateForAction(secondAction, tempNavState);
// const initialState = RootNavigator.router.getStateForAction(secondAction);

// this reducer is special to navigation, it doesn't seem to access the full state
function navigationReducer(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case types.SIGNED_IN:
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case types.SIGN_OUT_USER:
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    default:
      nextState = RootNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

export default navigationReducer;
