import React, { memo, SFC } from 'react';
import { Image, Text, View } from 'react-native';
import styles from './styles';

const addBySwipeExample = require('../../assets/images/add-by-swipe-example.png');
const addFromDetailsExample = require('../../assets/images/add-from-details-example.png');

interface Props {}

const EmptyMyAdds: SFC<Props> = ({  }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={[styles.text, styles.title]}>My Adds</Text>
        <Text style={[styles.text, styles.copy]}>
          Think of this as your “saved for later” list! Recommendations you are
          interested in checking out can be found here.
        </Text>
      </View>
      <View style={styles.block}>
        <Text style={[styles.text, styles.copy]}>
          To add a recommendation to your list, swipe from left-to-right.
        </Text>
        <View style={styles.shadow}>
          <Image style={styles.image} source={addBySwipeExample} />
        </View>
      </View>
      <View style={styles.block}>
        <Text style={[styles.text, styles.copy]}>
          Or you can tap add from the Details screen.
        </Text>
        <View style={styles.shadow}>
          <Image style={styles.image} source={addFromDetailsExample} />
        </View>
      </View>
    </View>
  );
};

export default memo(EmptyMyAdds);
