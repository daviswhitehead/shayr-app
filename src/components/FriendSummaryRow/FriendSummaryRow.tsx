import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import { UserImageWithNavigateToTheirList } from '../../higherOrderComponents/withNavigateToTheirList';
import { names } from '../Icon';
import IconWithCount from '../IconWithCount';
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
        <UserImage isLoading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserImageWithNavigateToTheirList
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
