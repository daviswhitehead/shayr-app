import _ from 'lodash';
import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { names } from '../Icon';
import IconWithCount from '../IconWithCount';
import styles from './styles';

export interface Props {
  startingIndex?: number;
  onIndexChange?: (index: number) => void;
  sharesCount?: number;
  addsCount?: number;
  donesCount?: number;
  commentsCount?: number;
  // likesCount?: number;
  isLoading?: boolean;
}

export interface State {
  selectedIndex: number;
}

export default class SegmentedControl extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: this.props.startingIndex || 0
    };
  }

  handleIndexChange = (index: number) => {
    if (this.props.onIndexChange) {
      this.props.onIndexChange(index);
    }

    this.setState((previousState) => ({
      ...previousState,
      selectedIndex: index
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.segment,
            this.state.selectedIndex === 0 ? styles.activeSegment : {}
          ]}
          onPress={() => this.handleIndexChange(0)}
        >
          <View style={styles.iconContainer}>
            <IconWithCount
              isLoading={this.props.isLoading}
              name={names.SHARE}
              count={this.props.sharesCount || 0}
              isActive={false}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            this.state.selectedIndex === 1 ? styles.activeSegment : {}
          ]}
          onPress={() => this.handleIndexChange(1)}
        >
          <View style={styles.iconContainer}>
            <IconWithCount
              isLoading={this.props.isLoading}
              name={names.ADD}
              count={this.props.addsCount || 0}
              isActive={false}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            this.state.selectedIndex === 2 ? styles.activeSegment : {}
          ]}
          onPress={() => this.handleIndexChange(2)}
        >
          <View style={styles.iconContainer}>
            <IconWithCount
              isLoading={this.props.isLoading}
              name={names.DONE}
              count={this.props.donesCount || 0}
              isActive={false}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            this.state.selectedIndex === 3 ? styles.activeSegment : {}
          ]}
          onPress={() => this.handleIndexChange(3)}
        >
          <View style={styles.iconContainer}>
            <IconWithCount
              isLoading={this.props.isLoading}
              name={names.REACTION}
              count={this.props.commentsCount || 0}
              isActive={false}
            />
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.segment,
            this.state.selectedIndex === 3 ? styles.activeSegment : {}
          ]}
          onPress={() => this.handleIndexChange(3)}
        >
          <View style={styles.iconContainer}>
            <IconWithCount
              isLoading={this.props.isLoading}
              name={names.LIKE}
              count={this.props.likesCount || 0}
              isActive={false}
            />
          </View>
        </TouchableOpacity> */}
      </View>
    );
  }
}
