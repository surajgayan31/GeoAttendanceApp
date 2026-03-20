import { CommonActions, StackActions } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

let navigator: any; // Holds the reference to the top-level navigator

/**
 * Set the top-level navigator reference to be used globally
 * @param navigatorRef - The reference to the top-level navigator
 */
function setTopLevelNavigator(navigatorRef: any) {
  navigator = navigatorRef;
}

/**
 * Navigate to a different screen
 * @param routeName - The name of the route to navigate to
 * @param params - The parameters to pass to the route
 */
function navigate(routeName: string, params?: object) {
  navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    }),
  );
}

/**
 * Pop the current screen off the stack (go back)
 * @param n - The number of screens to pop (default is 1)
 */
function pop(n = 1) {
  navigator.dispatch(
    StackActions.pop({
      n: n,
    }),
  );
}

/**
 * Push a new screen onto the stack
 * @param routeName - The name of the route to push
 * @param params - The parameters to pass to the new screen
 */
function push(routeName: string, params: any) {
  navigator.dispatch(StackActions.push(routeName, params));
}

/**
 * Reset the navigation stack and navigate to a new route
 * @param route - The route to reset to
 */
function reset(route: string) {
  navigator.dispatch(
    CommonActions.reset({
      index: 0, // Make the route at index 0 the active one
      routes: [{ name: route }],
    }),
  );
}

/**
 * Go back to the previous screen
 */
function goBack() {
  navigator.dispatch(CommonActions.goBack());
}

/**
 * Open the drawer navigation
 */
function openDrawer() {
  navigator.dispatch(DrawerActions.openDrawer());
}

/**
 * Close the drawer navigation
 */
function closeDrawer() {
  navigator.dispatch(DrawerActions.closeDrawer());
}

/**
 * Replace the current screen with a new one
 * @param routeName - The name of the route to replace the current screen with
 * @param params - The parameters to pass to the new screen
 */
function replace(routeName: string, params?: object) {
  navigator.dispatch(StackActions.replace(routeName, params));
}

// Export all the functions for global navigation use
export default {
  goBack,
  navigate,
  setTopLevelNavigator,
  openDrawer,
  closeDrawer,
  pop,
  reset,
  push,
  replace,
};
