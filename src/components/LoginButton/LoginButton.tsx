import React, { memo, SFC } from 'react';
import { Text } from 'react-native';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import Icon, { names } from '../Icon';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

interface Props {
  type: 'facebook' | 'google';
  onPress: () => void;
}

const LoginButton: SFC<Props> = ({ type, onPress }: Props) => {
  const containerStyle = [styles.container];
  if (type === 'facebook') {
    containerStyle.push(styles.facebookContainer);
  }

  const iconStyle = [styles.icon];
  if (type === 'facebook') {
    iconStyle.push(styles.facebookIcon);
  }

  return (
    <TouchableWrapper
      style={containerStyle}
      onPress={onPress}
      eventName={AnalyticsDefinitions.category.ACTION}
      eventParams={{
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.PRIMARY_BUTTON,
        [AnalyticsDefinitions.parameters.TYPE]: AnalyticsDefinitions.type.PRESS
      }}
    >
      <Icon
        iconStyle={iconStyle}
        size={24}
        color='white'
        name={names.FACEBOOK}
      />
      <Text style={styles.text}>Login With Facebook</Text>
    </TouchableWrapper>
  );
};

export default memo(LoginButton);
