import React, { memo, SFC } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { getActiveRouteName } from '../../lib/ReactNavigationHelpers';
import Icon, { names } from '../Icon';
import styles from './styles';

enum tabRoutes {
  DISCOVER_TAB = 'DiscoverTab',
  MYLIST_TAB = 'MyListTab',
  FRIENDS_TAB = 'FriendsTab'
}

interface NavigationParams {}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  onTabPress: () => void;
  onTabLongPress: () => void;
  navigation: Navigation;
}

const INACTIVE_ROUTE_ICON_MAP = {
  [tabRoutes.DISCOVER_TAB]: names.DISCOVER,
  [tabRoutes.MYLIST_TAB]: names.LIST,
  [tabRoutes.FRIENDS_TAB]: names.FRIENDS
};
const ACTIVE_ROUTE_ICON_MAP = {
  [tabRoutes.DISCOVER_TAB]: names.DISCOVER_ACTIVE,
  [tabRoutes.MYLIST_TAB]: names.LIST_ACTIVE,
  [tabRoutes.FRIENDS_TAB]: names.FRIENDS_ACTIVE
};

const TabBar: SFC<Props> = ({ onTabPress, onTabLongPress, navigation }) => {
  const { routes, index: activeRouteIndex } = navigation.state;

  // visibility logic
  const currentRoute = getActiveRouteName(navigation.state);
  const visible = !(['PostDetail', 'Settings'].indexOf(currentRoute) >= 0);

  return visible ? (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.tabBar}>
          {routes.map((route: { routeName: tabRoutes }, routeIndex) => {
            const isRouteActive = routeIndex === activeRouteIndex;
            const name = isRouteActive
              ? ACTIVE_ROUTE_ICON_MAP[route.routeName]
              : INACTIVE_ROUTE_ICON_MAP[route.routeName];

            return (
              <TouchableOpacity
                key={routeIndex}
                style={styles.tabButton}
                onPress={() => {
                  onTabPress({ route });
                }}
                onLongPress={() => {
                  onTabLongPress({ route });
                }}
              >
                <Icon name={name} />
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  ) : null;
};

export default memo(TabBar);
