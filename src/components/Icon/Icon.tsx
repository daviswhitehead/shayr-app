import * as React from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/fonts/selection.json';
import colors from '../../styles/Colors';
import TouchableWrapper from '../TouchableWrapper';
import styles from './styles';

const PostActionIcons = createIconSetFromIcoMoon(icoMoonConfig);

export type names = 'share' | 'add' | 'done' | 'like';

export interface Props {
  name: names;
  isActive?: boolean;
  onPress?: () => void | undefined;
  style?: any;
}

const Icon: React.SFC<Props> = ({
  name,
  isActive = false,
  onPress,
  style = {}
}: Props) => {
  const color: string = isActive ? colors.YELLOW : colors.BLACK;

  const icon = <PostActionIcons name={name} size={16} color={color} />;

  return (
    <TouchableWrapper style={[styles.container, style]} onPress={onPress}>
      {icon}
    </TouchableWrapper>
  );
};

export default Icon;
