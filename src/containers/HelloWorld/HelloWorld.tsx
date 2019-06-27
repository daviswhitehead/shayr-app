import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { facebookProfilePhoto } from '../../../../shayr-resources/src/DataModel/Fields';
import Icon from '../../components/Icon';
import IconWithCount from '../../components/IconWithCount';
import PostCard from '../../components/PostCard';
import UserAvatar from '../../components/UserAvatar';
import UserImage from '../../components/UserImage';
import styles from './styles';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.subscriptions.push();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  render() {
    console.log(this.state);
    console.log(this.props);

    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text>Hello World</Text>
          <UserImage
            uri='https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd'
            size='small'
          />
          <UserImage uri='' size='small' />
          <UserAvatar
            facebookProfilePhoto='https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd'
            firstName='Bob'
            lastName='Sanders'
            isVertical={true}
          />
          <PostCard
            post={{
              url: 'https://nngroup.com/articles/which-ux-research-methods/',
              image:
                'https://media.nngroup.com/media/articles/opengraph_images/UX_Research_Methods.png',
              userId: '1',
              shareCount: 1,
              postId: '6mN6SsgdI84JpCimZovI',
              createdAt: '2019-03-20T03:23:46.872Z',
              title: 'When to Use Which User-Experience Research Methods',
              shares: ['m592UXpes3azls6LnhN2VOf2PyT2'],
              updatedAt: '2019-03-20T03:23:46.872Z',
              addCount: 1,
              doneCount: 1,
              publisher: {
                name: 'Nielsen Norman Group',
                logo: ''
              },
              likeCount: 1,
              medium: 'text',
              description:
                '20 user-research methods: where they fit in the design process, whether they are attitudinal or behavioral, qualitative or quantitative, and their context of use.'
            }}
            users={{
              m592UXpes3azls6LnhN2VOf2PyT2: {
                createdAt: '2019-04-13T22:28:44.785Z',
                pushToken:
                  'e0gF6cGPh-s:APA91bGSMqtBcJYfwgtZn1LzGKtOogUNuXDt6D_FOedcgh8tyFkPNOcDg7_EC4fw4wDZtk27_Dc7aCykgn-KGoIK4XFnxlGHT7ig6OKPapCzXiPawTUN1THj26FkK3jcv7OOh_UkNB3V',
                facebookProfilePhoto:
                  'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd',
                lastName: 'Sanders',
                firstName: 'Bob',
                updatedAt: '2019-06-26T18:05:14.331Z',
                email: 'chillywilly.bootato@gmail.com'
              }
            }}
          />
          <PostCard
            post={{
              url: 'https://nngroup.com/articles/which-ux-research-methods/',
              image:
                'https://media.nngroup.com/media/articles/opengraph_images/UX_Research_Methods.png',
              userId: '1',
              shareCount: 1,
              postId: '6mN6SsgdI84JpCimZovI',
              createdAt: '2019-03-20T03:23:46.872Z',
              title: 'When to Use Which User-Experience Research Methods',
              shares: ['m592UXpes3azls6LnhN2VOf2PyT2'],
              updatedAt: '2019-03-20T03:23:46.872Z',
              addCount: 1,
              doneCount: 1,
              publisher: {
                name: 'Nielsen Norman Group',
                logo: ''
              },
              likeCount: 1,
              medium: 'text',
              description:
                '20 user-research methods: where they fit in the design process, whether they are attitudinal or behavioral, qualitative or quantitative, and their context of use.'
            }}
            users={{
              m592UXpes3azls6LnhN2VOf2PyT2: {
                createdAt: '2019-04-13T22:28:44.785Z',
                pushToken:
                  'e0gF6cGPh-s:APA91bGSMqtBcJYfwgtZn1LzGKtOogUNuXDt6D_FOedcgh8tyFkPNOcDg7_EC4fw4wDZtk27_Dc7aCykgn-KGoIK4XFnxlGHT7ig6OKPapCzXiPawTUN1THj26FkK3jcv7OOh_UkNB3V',
                facebookProfilePhoto:
                  'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd',
                lastName: 'Sanders',
                firstName: 'Bob',
                updatedAt: '2019-06-26T18:05:14.331Z',
                email: 'chillywilly.bootato@gmail.com'
              }
            }}
            withoutUser={true}
          />
          <PostCard
            post={{
              url: 'https://nngroup.com/articles/which-ux-research-methods/',
              image: '',
              userId: '1',
              shareCount: 1,
              postId: '6mN6SsgdI84JpCimZovI',
              createdAt: '2019-03-20T03:23:46.872Z',
              title: 'When to Use Which User-Experience Research Methods',
              shares: ['m592UXpes3azls6LnhN2VOf2PyT2'],
              updatedAt: '2019-03-20T03:23:46.872Z',
              addCount: 1,
              doneCount: 1,
              publisher: {
                name: 'Nielsen Norman Group',
                logo: ''
              },
              likeCount: 1,
              medium: 'text',
              description:
                '20 user-research methods: where they fit in the design process, whether they are attitudinal or behavioral, qualitative or quantitative, and their context of use.'
            }}
            users={{
              m592UXpes3azls6LnhN2VOf2PyT2: {
                createdAt: '2019-04-13T22:28:44.785Z',
                pushToken:
                  'e0gF6cGPh-s:APA91bGSMqtBcJYfwgtZn1LzGKtOogUNuXDt6D_FOedcgh8tyFkPNOcDg7_EC4fw4wDZtk27_Dc7aCykgn-KGoIK4XFnxlGHT7ig6OKPapCzXiPawTUN1THj26FkK3jcv7OOh_UkNB3V',
                facebookProfilePhoto:
                  'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd',
                lastName: 'Sanders',
                firstName: 'Bob',
                updatedAt: '2019-06-26T18:05:14.331Z',
                email: 'chillywilly.bootato@gmail.com'
              }
            }}
            withoutUser={true}
            noTouching={true}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloWorld);
