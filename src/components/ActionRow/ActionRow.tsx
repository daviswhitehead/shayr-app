import React, { memo, SFC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon, { names } from '../Icon';
import Skeleton from '../Skeleton';
import styles from './styles';

interface Props {
  isLoading?: boolean;
  onPress: () => void;
  iconName: names;
  copy: string;
}

const ActionRow: SFC<Props> = ({
  isLoading,
  onPress,
  iconName,
  copy
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Icon isLoading />
        <Skeleton style={styles.copySkeleton} />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon
        style={[styles.icon, styles.iconSize]}
        iconStyle={styles.iconSize}
        name={iconName}
        size={styles.iconSize.height}
      />
      <Text style={styles.copy}>{copy}</Text>
    </TouchableOpacity>
  );
};

export default memo(ActionRow);
