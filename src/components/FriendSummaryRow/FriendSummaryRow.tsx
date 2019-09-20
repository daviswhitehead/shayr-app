import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import { UserImageWithMyListNavigation } from '../../higherOrderComponents/withConditionalNavigation';
import { names } from '../Icon';
import IconWithCount from '../IconWithCount';
import Skeleton from '../Skeleton';
import UserImage from '../UserImage';
import styles from './styles';

// TODO: combine disparate UserAtom definitions
interface UserAtom {
  facebookProfilePhoto: string;
  firstName: string;
  lastName: string;
  _id: string;
}

interface Props extends UserAtom {
  isLoading?: boolean;
  sharesCount?: number;
  addsCount?: number;
  donesCount?: number;
  commentsCount?: number;
}

const FriendSummaryRow: SFC<Props> = ({
  _id,
  facebookProfilePhoto,
  firstName,
  lastName,
  isLoading,
  sharesCount,
  addsCount,
  donesCount,
  commentsCount
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <UserImage isLoading size='medium' style={styles.userImage} />
        <View style={styles.detailsContainer}>
          <Skeleton childStyle={styles.userNameSkeleton} />
          <View style={styles.iconsContainer}>
            <IconWithCount isLoading />
            <View style={styles.actionsSpacer} />
            <IconWithCount isLoading />
            <View style={styles.actionsSpacer} />
            <IconWithCount isLoading />
            <View style={styles.actionsSpacer} />
            <IconWithCount isLoading />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserImage
        uri={facebookProfilePhoto}
        size='medium'
        style={styles.userImage}
        userId={_id}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.userName}>
          {firstName} {lastName}
        </Text>
        <View style={styles.iconsContainer}>
          <IconWithCount name={names.SHARE} count={sharesCount || 0} />
          <View style={styles.actionsSpacer} />
          <IconWithCount name={names.ADD} count={addsCount || 0} />
          <View style={styles.actionsSpacer} />
          <IconWithCount name={names.DONE} count={donesCount || 0} />
          <View style={styles.actionsSpacer} />
          <IconWithCount name={names.REACTION} count={commentsCount || 0} />
        </View>
      </View>
    </View>
  );
};

export default memo(FriendSummaryRow);
