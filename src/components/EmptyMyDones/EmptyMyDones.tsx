import React, { memo, SFC } from 'react';
import { Image, Text, View } from 'react-native';
import styles from './styles';

const doneFromDetailsExample = require('../../assets/images/done-from-details-example.png');

interface Props {}

const EmptyMyDones: SFC<Props> = ({  }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={[styles.text, styles.title]}>My Dones</Text>
        <Text style={[styles.text, styles.copy]}>
          The full log of content you’ve finished on can be found here. After
          finishing a recommendation, we’ll let the original shayrer know so you
          can discuss :)
        </Text>
      </View>
      <View style={styles.block}>
        <Text style={[styles.text, styles.copy]}>
          To mark a recommendation as done, tap the done icon from the Details
          screen.
        </Text>
        <View style={styles.shadow}>
          <Image style={styles.image} source={doneFromDetailsExample} />
        </View>
      </View>
    </View>
  );
};

export default memo(EmptyMyDones);
