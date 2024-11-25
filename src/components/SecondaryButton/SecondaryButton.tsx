import React, { memo, SFC } from 'react';
import { Text } from 'react-native';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

interface Props {
  text: string;
  onPress: () => void;
  containerStyle?: any;
  textStyle?: any;
}

const SecondaryButton: SFC<Props> = ({
  text,
  onPress,
  containerStyle,
  textStyle
}: Props) => {
  return (
    <TouchableWrapper
      style={[styles.container, containerStyle]}
      onPress={onPress}
      eventName={AnalyticsDefinitions.category.ACTION}
      eventParams={{
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.SECONDARY_BUTTON,
        [AnalyticsDefinitions.parameters.TYPE]: AnalyticsDefinitions.type.PRESS,
        [AnalyticsDefinitions.parameters.RESULT]: text
      }}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableWrapper>
  );
};

export default memo(SecondaryButton);
