import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import SmartUserAvatar from '../SmartUserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

export interface Props {
  users: Users;
}

// const defaultProps = {
//   users: {
//     eTfuDaZVDuQhFsB5N6ssqOlA1Nk1: {
//       createdAt: '2019-04-28T18:21:43.962Z',
//       facebookProfilePhoto:
//         'https://lh3.googleusercontent.com/-9rAw7-0zCGc/AAAAAAAAAAI/AAAAAAAAB1c/rpSlx4KESWw/photo.jpg',
//       pushToken:
//         'ftnZmJLdUGY:APA91bH55JLXTy0WjOhI1rsCUqzT-0unfPKY-kg9qn0K_X1nzybcwSrnYQbzdOIml7KIdl8umbyZFs6LLG741ztK5py4QuRex4-ePiVL9qLfDd3ZPs9AZ6LmZO-8O7Qojz8Si5ECrhJ6',
//       lastName: 'Trahey',
//       firstName: 'Alex',
//       updatedAt: '2019-06-26T13:20:13.965Z',
//       email: 'alex.trahey@gmail.com'
//     },
//     ccwwwtXnL1d4oFFKwfBbxr3hzdy1: {
//       firstName: 'Jake',
//       updatedAt: '2019-06-17T16:46:50.143Z',
//       email: 'jaketaylorpro@gmail.com',
//       createdAt: '2019-03-28T14:37:34.196Z',
//       facebookProfilePhoto:
//         'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10101102651494459&height=200&width=200&ext=1559918568&hash=AeQl0Tx0z2Dneq7C',
//       pushToken:
//         'fywTp84teSM:APA91bECE-cqf-YbHCZhzA8pZ1ZSOf1-y5OKNGl2lbIMRdzbhy1UKTTtc9o27Pca6f3CJ2-d3gqZ-3__oV2AEpwb5iUjhQEIqO_iQw88S5w8q2F5NEzhqbFqpfhDF1CW6jIoxRx1_gcw',
//       lastName: 'Taylor'
//     },
//     uoguUzphvgfwerXGFOfBifkqVYo1: {
//       updatedAt: '2019-06-25T12:05:02.846Z',
//       email: 'whitehead.davis@gmail.com',
//       createdAt: '2019-04-23T23:04:22.600Z',
//       facebookProfilePhoto:
//         'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10211413843358157&height=200&width=200&ext=1558724927&hash=AeQqR-9togdNrBF2',
//       pushToken:
//         'cf90Q_ccw1A:APA91bErRJ0i_alg7rz3JuTjpd0jVA4W3UQEzpe1IeYCa8NPb3zXL6OPWKPlFYNSfCnLo5D_IhaSRaAcu8bo36vqTbwNjDIKHSqob-jvImBUwibrmt4eQQXsK3nXuqPtadol5utaKW-w',
//       lastName: 'Whitehead',
//       firstName: 'Davis'
//     },
//     yGeitGL1GKXYuRbI6FA4woQCNG53: {
//       createdAt: '2019-03-25T23:08:16.919Z',
//       facebookProfilePhoto:
//         'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10157182320713624&height=200&width=200&ext=1561327837&hash=AeRmw26F6wWPhTk3',
//       pushToken:
//         'fqbK8TWiwyk:APA91bHWc4Etk06JW-nB8713oS50UjTFmCRqgBe0ZdjE7bHlp4qzscfsDGgeSgjxvwH87f7N_0P50tNzNkAvKRLSPArRtck9-ndVx663PwydV7NSGnc6wW2yo-GrM5LB5Z36dnSKXl0J',
//       lastName: 'Ode',
//       firstName: 'Alex',
//       updatedAt: '2019-06-21T21:41:25.785Z',
//       email: 'alexode0@gmail.com'
//     }
//   }
// };

const UserAvatarsScrollView: React.SFC<Props> = ({ users }: Props) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {_.reduce(
        users,
        (result: Array<JSX.Element>, value: any, key: string) => {
          result.push(
            <View style={styles.avatarContainer} key={key}>
              <SmartUserAvatar {...value} userId={value._id} />
            </View>
          );
          return result;
        },
        []
      )}
    </ScrollView>
  );
};

// UserAvatarsScrollView.defaultProps = defaultProps;

export default UserAvatarsScrollView;
