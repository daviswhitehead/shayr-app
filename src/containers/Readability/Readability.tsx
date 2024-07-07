import React, { Component } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { WebView } from 'react-native-webview';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import Header from '../../components/Header';
import { State } from '../../redux/Reducers';
import Colors from '../../styles/Colors';
import styles from './styles';

interface StateProps {
  url: string;
  id: string;
}

interface DispatchProps {}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface OwnState {
  isLoadingHtml: boolean;
  isHtmlDownloaded: boolean;
  html?: string;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (
  state: State,
  { navigation }: NavigationScreenProps<NavigationState, NavigationParams>
) => {
  const url = navigation.state.params.url;
  const id = navigation.state.params.id;
  return {
    url,
    id
  };
};

const mapDispatchToProps = {};

class Readability extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  dir: string;
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoadingHtml: true,
      isHtmlDownloaded: false
    };

    this.dir = `${RNFetchBlob.fs.dirs.CacheDir}/posts/${this.props.id}.html`;
  }

  componentDidMount = async () => {
    await this.getFile(this.dir);
  };

  componentDidUpdate = async () => {
    if (
      !this.state.html &&
      !this.state.isLoadingHtml &&
      !this.state.isHtmlDownloaded
    ) {
      await this.downloadFile(this.dir, this.props.url);
      await this.getFile(this.dir);
    }
  };

  getFile = async (dir: string) => {
    await RNFetchBlob.fs
      .readFile(dir, 'utf8')
      .then((data) => {
        this.setState({ html: data, isLoadingHtml: false });
        return;
      })
      .catch((error) => {
        this.setState({ isLoadingHtml: false });
        return;
      });
  };

  downloadFile = async (dir: string, url: string) => {
    await RNFetchBlob.config({
      path: dir
    })
      .fetch('GET', url)
      .then((res) => {
        return;
      })
      .catch((error) => {
        return;
      });
    this.setState({ isHtmlDownloaded: true });
  };

  handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('logging scroll position');
    console.log(event.nativeEvent.contentOffset.y);
  };

  onMessage = (event: WebViewMessageEvent) => {
    console.log('event');
    console.log(event);
    console.log(event.nativeEvent.data);
    console.log(JSON.parse(event.nativeEvent.data));
  };

  render() {
    const injectedScript = `
    function waitForBridge() {
      if (!window.ReactNativeWebView.postMessage) {
        setTimeout(waitForBridge, 100);
      } else {
        window.scrollTo({
          left: 0,
          top: 1000,
          behavior: 'auto'
        })
        document.addEventListener(
          'scroll',
          function (event) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify(
                {
                  scrollY: window.scrollY,
                  height: Math.max(
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.body.clientHeight,
                    document.body.scrollHeight
                  )
                }
              )
            );
          },
          true
        );
      }
    }
    waitForBridge();
    true;
  `;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={Colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Readability'
          back={() => this.props.navigation.goBack(null)}
        />
        {this.state.isLoadingHtml ? null : (
          <WebView
            source={{ html: this.state.html }}
            style={styles.webView}
            cacheEnabled
            cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
            overScrollMode='always'
            scrollEnabled
            mediaPlaybackRequiresUserAction
            javaScriptEnabled={true}
            injectedJavaScript={injectedScript}
            onMessage={this.onMessage}
          />
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Readability);
