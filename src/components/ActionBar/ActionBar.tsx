import { documentId, User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import withAdds from '../../higherOrderComponents/withAdds';
import withDones from '../../higherOrderComponents/withDones';
import withLikes from '../../higherOrderComponents/withLikes';
import withShares, {
  IconWithShares
} from '../../higherOrderComponents/withShares';
import Icon from '../Icon';
import SmartUserAvatar from '../SmartUserAvatar';
import styles from './styles';

export interface Props {
  authUser: User;
  post: UsersPosts;
  ownerUserId: documentId;
}

const ActionBar: React.SFC<Props> = ({ authUser, post, ownerUserId }) => {
  // const IconWithShares = withShares(Icon.default, post, ownerUserId);
  const IconWithDones = withDones(Icon.default, post, ownerUserId);
  const IconWithAdds = withAdds(Icon.default, post, ownerUserId);
  const IconWithLikes = withLikes(Icon.default, post, ownerUserId);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.actionBar}>
          <SmartUserAvatar
            {...authUser}
            userId={authUser._id}
            firstName={undefined}
            lastName={undefined}
            style={styles.action}
          />
          <IconWithShares name='share' style={styles.action} post={post} />
          <IconWithAdds name='add' style={styles.action} />
          <IconWithDones name='done' style={styles.action} />
          <IconWithLikes name='like' style={styles.action} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ActionBar;
