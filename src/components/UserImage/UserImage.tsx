import * as React from 'react';
import { Image, View } from 'react-native';
import colors from '../../styles/Colors';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

export type size = 'small' | 'medium' | 'large';

export interface Props {
  uri: string;
  size?: string;
  onPress?: () => void | undefined;
  style?: any;
}

const UserImage: React.SFC<Props> = ({
  uri,
  size = 'small',
  onPress,
  style = {}
}: Props) => {
  return (
    <TouchableWrapper onPress={onPress} style={[styles.imageBox, style]}>
      {!!uri ? (
        <Image style={styles[size]} source={{ uri }} />
      ) : (
        <View
          style={{
            ...styles[size],
            backgroundColor: colors.LIGHT_GRAY
          }}
        />
      )}
    </TouchableWrapper>
  );
};

export default UserImage;
