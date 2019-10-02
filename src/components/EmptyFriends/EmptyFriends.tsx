import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import PrimaryButton from '../PrimaryButton';
import styles from './styles';

interface Props {
  onButtonPress: () => void;
}

const EmptyFriends: SFC<Props> = ({ onButtonPress }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={[styles.text, styles.title]}>
          Shayr is Better with Friends
        </Text>
        <Text style={[styles.text, styles.copy]}>
          You need friends to send and receive personalized content
          recommendations!
        </Text>
      </View>
      <PrimaryButton
        text={'Find Friends'}
        onPress={onButtonPress}
        containerStyle={styles.button}
      />
    </View>
  );
};

export default memo(EmptyFriends);
