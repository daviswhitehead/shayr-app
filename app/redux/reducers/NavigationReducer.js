import { NavigationActions } from 'react-navigation';
import { RootNavigator } from '../../config/Routes';
import { authenticationActionTypes, authenticationActions } from '../Actions';

const firstAction = RootNavigator.router.getActionForPathAndParams('Feed');
const tempNavState = RootNavigator.router.getStateForAction(firstAction);
const secondAction = RootNavigator.router.getActionForPathAndParams('Login');
const initialState = RootNavigator.router.getStateForAction(secondAction, tempNavState);

// this reducer is special to navigation, it doesn't seem to access the full state
function navigationReducer(state = initialState, action) {
  console.log(action);
  let nextState;
  switch (action.type) {
    case authenticationActionTypes.SIGN_IN:
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case authenticationActionTypes.SIGN_OUT:
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
