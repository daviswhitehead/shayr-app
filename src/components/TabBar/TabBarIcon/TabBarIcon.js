import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const iconMap = {
  DiscoverTab: 'search',
  MyListTab: 'format-list-bulleted',
  FriendsTab: 'people'
};

const TabBarIcon = ({ name, color, active }) => {
  const iconName = iconMap[name];
  // todo: implement icon active-styling const style = active ? BOLD : LIGHT;

  return <Icon name={iconName} size={24} color={color} />;
};

TabBarIcon.propTypes = {
  active: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.oneOf(['DiscoverTab', 'MyListTab', 'FriendsTab']).isRequired
};

export default TabBarIcon;
