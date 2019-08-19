import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import Skeleton from '../Skeleton';
import SmartUserAvatar from '../SmartUserAvatar';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

export interface Props {
  user: User;
  text: string;
  createdAt: Date;
  title?: string;
  onPressContainer?: () => void | undefined;
  onPressTitle?: () => void | undefined;
  noTouching?: boolean;
  isLoading?: boolean;
}

const UserTextDate: SFC<Props> = ({
  text,
  createdAt,
  title,
  onPressContainer,
  user,
  onPressTitle,
  noTouching = false,
  isLoading = false
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <UserImage isLoading style={styles.userImageSpacing} />
        <View style={styles.textContainer}>
          <Skeleton childStyle={styles.skeletonText} />
          <Skeleton childStyle={styles.skeletonDate} />
        </View>
      </View>
    );
  }
  const parsedText = user.shortName
    ? _.replace(text, user.shortName, '')
    : text;

  return (
    <TouchableWrapper
      style={styles.container}
      onPress={noTouching ? undefined : onPressContainer}
    >
      <SmartUserAvatar
        {...user}
        shouldHideName
        userId={user._id}
        style={styles.userImageSpacing}
      />
      <View style={styles.textContainer}>
        <Text>
          {user.shortName ? (
            <Text style={styles.boldText}>{`${user.shortName} `}</Text>
          ) : null}
          <Text style={styles.text}>{_.trim(parsedText)}</Text>
          {title ? (
            <Text style={styles.boldText} onPress={onPressTitle}>
              {title}
            </Text>
          ) : null}
        </Text>
        <Text style={styles.date}>{moment(createdAt).fromNow()}</Text>
      </View>
    </TouchableWrapper>
  );
};

export default memo(UserTextDate);
