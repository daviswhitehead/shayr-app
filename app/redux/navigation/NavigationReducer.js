import { StackActions, NavigationActions } from "react-navigation";
import { RootNavigator } from "../../config/Routes";
import { types } from "../authentication/AuthenticationActions";

const firstAction = RootNavigator.router.getActionForPathAndParams("Login");
const initialState = RootNavigator.router.getStateForAction(firstAction);

// this reducer is special to navigation, it doesn't seem to access the full state
function navigationReducer(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case types.SIGNED_IN:
      signedInReset = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "LoginListeners" })]
      });
      nextState = RootNavigator.router.getStateForAction(signedInReset, state);
      break;
    case types.SIGN_OUT_USER:
      signedOutReset = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Login" })]
      });
      nextState = RootNavigator.router.getStateForAction(signedOutReset, state);
      break;
    default:
      nextState = RootNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

export default navigationReducer;
