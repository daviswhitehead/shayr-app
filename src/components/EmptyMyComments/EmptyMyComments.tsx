import React, { memo, SFC } from 'react';
import { Image, Text, View } from 'react-native';
import styles from './styles';

const commentFromPostExample = require('../../assets/images/comment-from-post-example.png');
const commentFromDetailsExample = require('../../assets/images/comment-from-details-example.png');

interface Props {}

const EmptyMyComments: SFC<Props> = ({  }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={[styles.text, styles.title]}>My Comments</Text>
        <Text style={[styles.text, styles.copy]}>
          Everything you’ve commented on can be found here. Sharing your opinion
          on something is a great way for your friends to get to know you
          better!
        </Text>
      </View>
      <View style={styles.block}>
        <Text style={[styles.text, styles.copy]}>
          To comment on something, tap the comment icon on a recommendation or
          from the Details screen.
        </Text>
        <View style={styles.shadow}>
          <Image style={styles.image} source={commentFromPostExample} />
        </View>
        <View style={styles.shadow}>
          <Image style={styles.image} source={commentFromDetailsExample} />
        </View>
      </View>
    </View>
  );
};

export default memo(EmptyMyComments);
