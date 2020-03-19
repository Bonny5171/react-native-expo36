import { NavigationActions } from 'react-navigation';
export const resetNavigate = (toRoute, navigation, params) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: toRoute, params })]
  });
  navigation.dispatch(resetAction);
};