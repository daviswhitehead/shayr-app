import PropTypes from 'prop-types';
import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { getActiveRouteName } from '../../lib/ReactNavigationHelpers';
import colors from '../../styles/Colors';
import Icon from '../Icon';
import styles from './styles';

const routeIconNameMap = {
  DiscoverTab: 'search',
  MyListTab: 'list',
  FriendsTab: 'friends'
};

const TabBar = (props) => {
  const { onTabPress, onTabLongPress, navigation } = props;

  // activity colors
  const activeTintColor = colors.BLACK;
  const inactiveTintColor = colors.DARK_GRAY;

  const { routes, index: activeRouteIndex } = navigation.state;

  // visibility logic
  const currentRoute = getActiveRouteName(navigation.state);
  const visible = !(['PostDetail', 'Settings'].indexOf(currentRoute) >= 0);

  return visible ? (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.tabBar}>
          {routes.map((route, routeIndex) => {
            const isRouteActive = routeIndex === activeRouteIndex;
            const tintColor = isRouteActive
              ? activeTintColor
              : inactiveTintColor;
            const name = isRouteActive
              ? routeIconNameMap[route.routeName] + '-active'
              : routeIconNameMap[route.routeName];

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
                <Icon.default name={name} />
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  ) : null;
};

TabBar.propTypes = {
  onTabPress: PropTypes.func.isRequired,
  onTabLongPress: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

export default TabBar;
