import _ from 'lodash';
import * as React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import Colors from '../../styles/Colors';
import styles from './styles';

interface Props extends FlatList<any> {
  data: Array<any>;
  renderItem: (item: any) => JSX.Element;
  onScroll?: () => void;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  isLoading?: boolean;
  isLoadedAll?: boolean;
  noSeparator?: boolean;
}

const List: React.SFC<Props> = ({
  data,
  renderItem,
  onScroll,
  onEndReached,
  onRefresh,
  refreshing,
  isLoading,
  isLoadedAll,
  noSeparator,
  ...passThroughProps
}) => {
  return (
    <FlatList
      style={styles.container}
      data={data}
      renderItem={({ item }) => renderItem(item)}
      keyExtractor={({ key }) => key}
      ItemSeparatorComponent={
        noSeparator ? null : () => <View style={styles.separator} />
      }
      onScroll={onScroll}
      onEndReached={isLoadedAll ? null : onEndReached}
      onEndReachedThreshold={0.1}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={() => {
        if (_.isEmpty(data) && !isLoading) {
          return (
            <View style={styles.loadingContainer}>
              <Text>List is empty</Text>
            </View>
          );
        }
        return null;
      }}
      ListFooterComponent={() => {
        if (!_.isEmpty(data) && isLoadedAll) {
          return (
            <View style={styles.loadingContainer}>
              <Text>List is loaded</Text>
            </View>
          );
        } else if (isLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={Colors.BLACK} />
            </View>
          );
        }
        return null;
      }}
      {...passThroughProps}
    />
  );
};

export default List;
