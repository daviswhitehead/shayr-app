import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import { UserAvatarWithMyListNavigation } from '../../higherOrderComponents/withConditionalNavigation';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

interface Props {
  user: User;
  text: string;
  createdAt: Date;
  onPressContainer?: () => void | undefined;
  noTouching?: boolean;
  isLoading?: boolean;
  isNotification?: boolean;
}

const UserTextDate: SFC<Props> = ({
  text,
  createdAt,
  onPressContainer,
  user,
  noTouching = false,
  isLoading = false,
  isNotification = false
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <UserImage isLoading style={styles.userImageSpacing} />
        <View style={styles.textContainer}>
          <Skeleton childStyle={styles.skeletonDate} />
          <Skeleton childStyle={styles.skeletonText} />
        </View>
      </View>
    );
  }

  let parsedText = text;
  if (isNotification) {
    parsedText = _.replace(text, `${user.shortName} `, '');
    parsedText = isNotification ? _.upperFirst(parsedText) : parsedText;
  }

  return (
    <TouchableWrapper
      style={styles.container}
      onPress={noTouching ? undefined : onPressContainer}
    >
      <UserAvatarWithMyListNavigation
        {...user}
        shouldHideName
        userId={user._id}
        style={styles.userImageSpacing}
      />
      <View style={styles.textContainer}>
        <View style={styles.nameDateContainer}>
          <Text style={styles.boldText}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.date}>{moment(createdAt).fromNow()}</Text>
        </View>
        <Text style={styles.text}>{_.trim(parsedText)}</Text>
      </View>
    </TouchableWrapper>
  );
};

export default memo(UserTextDate);
