// https://facebook.github.io/react-native/docs/flatlist
// https://facebook.github.io/react-native/docs/optimizing-flatlist-configuration
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import Colors from '../../styles/Colors';
import styles from './styles';

interface Props {
  data: Array<any>;
  renderItem: (item: any) => JSX.Element;
  onScroll?: () => void;
  onEndReached?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  isPaginating?: boolean;
  isLoadedAll?: boolean;
  noSeparator?: boolean;
  passThroughProps?: FlatList<any>;
}

interface OwnState {}

class List extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  loadingData: Array<{ _id: string }>;
  constructor(props: Props) {
    super(props);
    this.loadingData = [
      { _id: '0' },
      { _id: '1' },
      { _id: '2' },
      { _id: '3' },
      { _id: '4' }
    ];
  }

  keyExtractor = (item: { _id: string }) => {
    return item._id;
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderEmptyComponent = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text>List is empty</Text>
      </View>
    );
  };

  renderFooterComponent = () => {
    if (!_.isEmpty(this.props.data) && this.props.isLoadedAll) {
      return (
        <View style={styles.loadingContainer}>
          <Text>List is loaded</Text>
        </View>
      );
    } else if (this.props.isPaginating) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.BLACK} />
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      data,
      renderItem,
      onScroll,
      onEndReached,
      onRefresh,
      isLoading,
      isRefreshing,
      isPaginating,
      isLoadedAll,
      noSeparator,
      ...passThroughProps
    } = this.props;

    return (
      <FlatList
        style={styles.container}
        data={isLoading ? this.loadingData : data}
        renderItem={renderItem}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={noSeparator ? null : this.renderSeparator}
        onScroll={onScroll}
        onEndReached={isLoadedAll || isLoading ? null : onEndReached}
        onEndReachedThreshold={0.05}
        onRefresh={isLoading ? null : onRefresh}
        refreshing={isLoading ? false : isRefreshing}
        ListEmptyComponent={this.renderEmptyComponent}
        ListFooterComponent={this.renderFooterComponent}
        {...passThroughProps}
      />
    );
  }
}

export default List;
