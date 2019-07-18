import _ from 'lodash';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import IconWithCount from '../IconWithCount';
import styles from './styles';

export interface Props {
  startingIndex?: number;
  onIndexChange?: (index: number) => void;
  sharesCount: number;
  addsCount: number;
  donesCount: number;
  likesCount: number;
}

export interface State {
  selectedIndex: number;
}

export default class SegmentedControl extends React.Component<Props, State> {
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

    this.setState(previousState => ({
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
              name={'share'}
              count={this.props.sharesCount}
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
              name={'add'}
              count={this.props.addsCount}
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
              name={'done'}
              count={this.props.donesCount}
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
              name={'like'}
              count={this.props.likesCount}
              isActive={false}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
