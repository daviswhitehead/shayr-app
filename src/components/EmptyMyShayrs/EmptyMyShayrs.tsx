import React, { memo, SFC } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import Icon, { names } from '../Icon';
import styles from './styles';

const shayrFromDetailsExample = require('../../assets/images/shayr-from-details-example.png');
const shayrFromPostExample = require('../../assets/images/shayr-from-post-example.png');
const androidShayrAppIcon = require('../../assets/images/android-shayr-app-icon.png');
const iosShayrAppIcon = require('../../assets/images/ios-shayr-app-icon.png');
const iosMoreAppIcon = require('../../assets/images/ios-more-app-icon.png');
const iosEnableShayrActionExample = require('../../assets/images/ios-enable-shayr-action-example.png');

interface Props {}

const EmptyMyShayrs: SFC<Props> = ({  }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={[styles.text, styles.title]}>My Shayrs</Text>
        <Text style={[styles.text, styles.copy]}>
          All the content recommendations you’ve shayred can be found here. Take
          a moment to reflect, has any recent content made you think of a
          friend? Why not shayr it with them?
        </Text>
      </View>
      <View style={styles.block}>
        <Text style={[styles.text, styles.copy]}>
          To shayr content from another app...
        </Text>
        {Platform.OS === 'ios' ? (
          <View style={styles.shareExtensionInstructionsContainer}>
            <View style={styles.listRowContainer}>
              <Text style={[styles.text, styles.copy, styles.listText]}>
                1. Find and tap the app’s share icon
              </Text>
              <Icon name={names.SHARE_APPLE} />
            </View>
            <View style={styles.listRowContainer}>
              <Text style={[styles.text, styles.copy, styles.listText]}>
                2. Find and tap Shayr
              </Text>
              <Image style={styles.appIcon} source={iosShayrAppIcon} />
            </View>
            <Text style={[styles.text, styles.copy, styles.listText]}>
              * If you can’t find Shayr, you need to enable it by tapping More,
              then toggling Shayr:
            </Text>
            <View style={[styles.listRowContainer, styles.enableContainer]}>
              <Image style={styles.moreAppIcon} source={iosMoreAppIcon} />
              <Icon name={names.ARROW} />
              <Image
                style={styles.enableShareImage}
                source={iosEnableShayrActionExample}
              />
            </View>
          </View>
        ) : (
          <View style={styles.shareExtensionInstructionsContainer}>
            <View style={styles.listRowContainer}>
              <Text style={[styles.text, styles.copy, styles.listText]}>
                1. Find and tap the app’s share icon
              </Text>
              <Icon name={names.SHARE_GOOGLE} />
            </View>
            <View style={styles.listRowContainer}>
              <Text style={[styles.text, styles.copy, styles.listText]}>
                2. Find and tap Shayr
              </Text>
              <Image style={styles.appIcon} source={androidShayrAppIcon} />
            </View>
          </View>
        )}
      </View>
      <View style={styles.block}>
        <Text style={[styles.text, styles.copy]}>
          For content inside Shayr, tap the shayr icon on a recommendation or
          from the Details screen.
        </Text>
        <View style={styles.shadow}>
          <Image style={styles.image} source={shayrFromPostExample} />
        </View>
        <View style={styles.shadow}>
          <Image style={styles.image} source={shayrFromDetailsExample} />
        </View>
      </View>
    </View>
  );
};

export default memo(EmptyMyShayrs);
