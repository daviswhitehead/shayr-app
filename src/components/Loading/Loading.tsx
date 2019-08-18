import React, { memo, SFC } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Colors from '../../styles/Colors';
import styles from './styles';

interface Props {}

const Loading: SFC<Props> = ({  }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={Colors.BLACK} />
    </View>
  );
};

export default memo(Loading);
