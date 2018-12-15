import {
  createReactNavigationReduxMiddleware,
  createNavigationPropConstructor
} from "react-navigation-redux-helpers";

const navMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);
const navigationPropConstructor = createNavigationPropConstructor("root");

export { navMiddleware, navigationPropConstructor };
