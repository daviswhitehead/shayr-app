import { UsersPostsType } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import Colors from '../../styles/Colors';
import styles from './styles';

interface Props {
  data: Array<UsersPostsType>;
  renderItem: (item: UsersPostsType) => JSX.Element;
  onScroll?: () => void;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  isLoading?: boolean;
  isLoadedAll?: boolean;
}

const List: React.SFC<Props> = props => {
  return (
    <FlatList
      style={styles.container}
      data={props.data}
      renderItem={({ item }) => props.renderItem(item)}
      keyExtractor={({ key }) => key}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onScroll={props.onScroll}
      onEndReached={props.isLoadedAll ? null : props.onEndReached}
      onEndReachedThreshold={0.25}
      onRefresh={props.onRefresh}
      refreshing={props.refreshing}
      ListEmptyComponent={() => {
        if (_.isEmpty(props.data)) {
          return (
            <View style={styles.loadingContainer}>
              <Text>List is empty</Text>
            </View>
          );
        }
        return null;
      }}
      ListFooterComponent={() => {
        if (props.isLoadedAll) {
          return (
            <View style={styles.loadingContainer}>
              <Text>Loaded all posts</Text>
            </View>
          );
        } else if (props.isLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={Colors.BLACK} />
            </View>
          );
        }
        return null;
      }}
    />
  );
};

export default List;
