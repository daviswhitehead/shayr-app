import * as React from 'react';
import { Text } from 'react-native';
import styles from './styles';

export interface Props {
  title: string;
}

const PostTitle: React.SFC<Props> = ({ title }: Props) => {
  return <Text style={styles.title}>{title}</Text>;
};

export default PostTitle;
