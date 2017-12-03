/* eslint-disable import/no-unresolved, import/extensions */
import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Linking,
  Share,
} from 'react-native';
import Swipeable from './components/Swipeable'
import Scores from './components/Scores'

/* eslint-enable import/no-unresolved, import/extensions */
export default class SwipeableExample extends Component {

  state = {
    currentlyOpenSwipeable: null,
    names: [
      {
        key: 'Alex',
        url: 'https://www.youtube.com/watch?v=SM1w9PEQOE8'
      },
      {
        key: 'Jesse',
        url: 'https://www.youtube.com/watch?v=qdq-zqTMS1U'
      },
      {
        key: 'Davis',
        url: 'https://www.youtube.com/watch?v=SM1w9PEQOE8'
      },
    ],
    text: ''
  };

  handleScroll = () => {
    const { currentlyOpenSwipeable } = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  render() {
    const { currentlyOpenSwipeable } = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }

        this.setState({ currentlyOpenSwipeable: swipeable });
      },
      onClose: () => this.setState({ currentlyOpenSwipeable: null })
    };

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 5 }}
          data={this.state.names}
          renderItem={({ item }) => <Example2 {...itemProps} text={item.key} url={item.url} />}
          ItemSeparatorComponent={
            () => <View style={{ height: 1, backgroundColor: "#000000", }} />
          }
        />
        <TextInput
          style={{ height: 50 }}
          placeholder="Add a link"
          onSubmitEditing={(event) => this.setState({ names: [...this.state.names, { key: event.nativeEvent.text }] })}
        />
      </View>
    );
  }
}

function Example1({ onOpen, onClose }) {
  return (
    <Swipeable
      leftContent={(
        <View style={[styles.leftSwipeItem, { backgroundColor: 'yellow' }]}>
          <Text>Pull action</Text>
        </View>
      )}
      rightButtons={[
        <TouchableOpacity style={[styles.rightSwipeItem, { backgroundColor: 'lightseagreen' }]}>
          <Text>1</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.rightSwipeItem, { backgroundColor: 'orchid' }]}>
          <Text>2</Text>
        </TouchableOpacity>
      ]}
      onRightButtonsOpenRelease={onOpen}
      onRightButtonsCloseRelease={onClose}
    >
      <View style={[styles.listItem, { backgroundColor: 'salmon' }]}>
        <Text>Example 1</Text>
      </View>
    </Swipeable>
  );
}

function openLink(url) {
  Linking.openURL(url).catch(err => console.error('An error occurred', err));
}

function shareLink(linkURL) {
  Share.share({
    message: 'I found this thing',
    url: linkURL,
    title: 'Cool Stuff'
  }, {
      // Android only:
      dialogTitle: 'Share this',
      // iOS only:
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter'
      ]
    })

  // react-native-share
  //   Share.open({title: 'Stuff', message: 'Look!', url: url, subject: 'Cool'});
}

function Example2({ onOpen, onClose, text, url }) {
  return (
    <Swipeable
      leftButtonWidth={45}
      leftButtons={[
        <TouchableOpacity onPress={() => { openLink(url) }} style={[styles.leftSwipeItem, { backgroundColor: 'papayawhip' }]}>
          <Text>Open</Text>
        </TouchableOpacity>,
        <TouchableOpacity onPress={() => { shareLink(url) }} style={[styles.leftSwipeItem, { backgroundColor: 'olivedrab' }]}>
          <Text>Share</Text>
        </TouchableOpacity>,
      ]}
      rightContent={(
        <View style={[styles.rightSwipeItem, { backgroundColor: 'linen' }]}>
          <Text>Pull action</Text>
        </View>
      )}
      onLeftButtonsOpenRelease={onOpen}
      onLeftButtonsCloseRelease={onClose}
    >
      <View style={[styles.listItem, { backgroundColor: '#FEA100' }]}>
        <Text>{text}</Text>
      </View>
    </Swipeable>
  );
}

class Example3 extends Component {

  state = {
    leftActionActivated: false,
    toggle: false
  };

  render() {
    const { leftActionActivated, toggle } = this.state;

    return (
      <Swipeable
        leftActionActivationDistance={200}
        leftContent={(
          <View style={[styles.leftSwipeItem, { backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue' }]}>
            {leftActionActivated ?
              <Text>release!</Text> :
              <Text>keep pulling!</Text>}
          </View>
        )}
        onLeftActionActivate={() => this.setState({ leftActionActivated: true })}
        onLeftActionDeactivate={() => this.setState({ leftActionActivated: false })}
        onLeftActionComplete={() => this.setState({ toggle: !toggle })}
      >
        <View style={[styles.listItem, { backgroundColor: toggle ? 'thistle' : 'darkseagreen' }]}>
          <Text>Example 3</Text>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },

});