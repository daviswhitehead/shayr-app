import _ from 'lodash';
import moment from 'moment';
import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import Skeleton from '../Skeleton';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

export interface Props {
  profilePhoto: string;
  text: string;
  createdAt: Date;
  userName?: string;
  title?: string;
  onPressContainer?: () => void | undefined;
  onPressAvatar?: () => void | undefined;
  onPressTitle?: () => void | undefined;
  noTouching?: boolean;
  isLoading?: boolean;
}

const UserAvatar: SFC<Props> = ({
  userName,
  profilePhoto,
  text,
  createdAt,
  title,
  onPressContainer,
  onPressAvatar,
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
  const parsedText = userName ? _.replace(text, userName, '') : text;

  return (
    <TouchableWrapper
      style={styles.container}
      onPress={noTouching ? undefined : onPressContainer}
    >
      <UserImage
        style={styles.userImageSpacing}
        uri={profilePhoto}
        size='small'
        onPress={onPressAvatar}
      />
      <View style={styles.textContainer}>
        <Text>
          {userName ? (
            <Text style={styles.boldText}>{`${userName} `}</Text>
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

export default memo(UserAvatar);
