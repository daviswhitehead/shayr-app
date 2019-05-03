import React from 'react';
import PropTypes from 'prop-types';
import FontBody from '../../Text/FontBody';
import { fonts } from '../../../styles/Fonts';

const labelMap = {
  Discover: 'Discover',
  MyList: 'My List',
  Friends: 'Friends',
};

const TabBarLabel = ({ name, color, active }) => {
  const label = labelMap[name];
  const style = active ? { ...fonts.BOLD, color } : { color };

  return <FontBody text={label} style={style} />;
};

TabBarLabel.propTypes = {
  active: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.oneOf(['Discover', 'MyList', 'Friends']).isRequired,
};

export default TabBarLabel;
