import React, { ComponentProps, memo, SFC } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Icon, { names } from '../Icon';
import SearchBar from '../SearchBar';
import StatusBar from '../StatusBar';
import styles from './styles';

interface Props extends ComponentProps<typeof SearchBar> {
  back: () => void;
}

const SearchHeader: SFC<Props> = ({ back, ref, onEdit, onSubmit }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView>
        <View style={styles.header}>
          <Icon name={names.BACK} onPress={back} />
          <SearchBar ref={ref} onEdit={onEdit} onSubmit={onSubmit} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default memo(SearchHeader);
