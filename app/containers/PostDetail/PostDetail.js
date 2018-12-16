import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { postAction } from "../../redux/postActions/PostActionsActions";
import { postDetailBack } from "./actions";
import Header from "../../components/Header";
import { colors } from "../../styles/Colors";
import styles from "./styles";
import PostImage from "../../components/PostImage";
import PostContext from "../../components/PostContext";
import PostAction from "../../components/PostAction";
import ProfileIcon from "../../components/ProfileIcon";
import FontBody from "../../components/FontBody";
import { openURL } from "../../lib/Utils";
import { getProfile } from "../../lib/SocialConnectors";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    postDetail: state.postDetail,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => ({
  postDetailBack: () => dispatch(postDetailBack()),
  postAction: (actionType, userId, postId) =>
    dispatch(postAction(actionType, userId, postId))
});

class PostDetail extends Component {
  static propTypes = {
    auth: PropTypes.shape({
      user: PropTypes.shape({
        uid: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    postDetail: PropTypes.shape({
      post: PropTypes.shape({
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        publisher: PropTypes.shape({
          name: PropTypes.string.isRequired,
          logo: PropTypes.string
        }),
        shares: PropTypes.arrayOf(PropTypes.string),
        adds: PropTypes.arrayOf(PropTypes.string),
        dones: PropTypes.arrayOf(PropTypes.string),
        likes: PropTypes.arrayOf(PropTypes.string),
        medium: PropTypes.string,
        shareCount: PropTypes.number,
        addCount: PropTypes.number,
        doneCount: PropTypes.number,
        likeCount: PropTypes.number,
        url: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    social: PropTypes.shape({
      friends: PropTypes.shape({
        friendId: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          facebookProfilePhoto: PropTypes.string
        })
      }).isRequired,
      self: PropTypes.shape({
        selfId: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          facebookProfilePhoto: PropTypes.string
        })
      }).isRequired
    }).isRequired
  };

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          backgroundColor={colors.WHITE}
          statusBarStyle="dark-content"
          title=""
          back={() => navigation.state.params.postDetailBack()}
        />
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      postDetailBack: this.props.postDetailBack
    });
  }

  collectFeaturedProfiles = (users, userIds) => {
    let profiles = [];
    for (const index in userIds) {
      if (userIds.hasOwnProperty(index)) {
        const profile = getProfile(users, userIds[index]);
        if (profile) {
          profiles.push(
            <ProfileIcon
              view={"large"}
              key={`${userIds[index]}_${index}`}
              uri={profile.facebookProfilePhoto}
              firstName={profile.firstName}
              lastName={profile.lastName}
            />
          );
        }
      }
    }
    return profiles;
  };

  render() {
    if (!this.props.postDetail.post) {
      return <View style={styles.container} />;
    }

    const { ...post } = { ...this.props.postDetail.post };
    const sharedBy = this.collectFeaturedProfiles(
      { ...this.props.social.friends, ...this.props.social.self },
      post.shares
    );
    const addedBy = this.collectFeaturedProfiles(
      { ...this.props.social.friends, ...this.props.social.self },
      post.adds
    );
    const donedBy = this.collectFeaturedProfiles(
      { ...this.props.social.friends, ...this.props.social.self },
      post.dones
    );
    const likedBy = this.collectFeaturedProfiles(
      { ...this.props.social.friends, ...this.props.social.self },
      post.likes
    );

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.contentBox}
            onPress={() => openURL(post.url)}
          >
            <PostImage view={"detail"} uri={post.image} />
            <PostContext
              title={post.title}
              publisher={post.publisher.name}
              actions={false}
            />
          </TouchableOpacity>
          <View style={styles.dividerBox}>
            <View style={styles.divider} />
            <View style={styles.actionBox}>
              <PostAction
                actionType={"share"}
                actionCount={post.shareCount}
                actionUser={
                  post.shares
                    ? post.shares.includes(this.props.auth.user.uid)
                    : false
                }
                onPress={() =>
                  this.props.postAction(
                    "share",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
              <PostAction
                actionType={"add"}
                actionCount={post.addCount}
                actionUser={
                  post.adds
                    ? post.adds.includes(this.props.auth.user.uid)
                    : false
                }
                onPress={() =>
                  this.props.postAction(
                    "add",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
              <PostAction
                actionType={"done"}
                actionCount={post.doneCount}
                actionUser={
                  post.dones
                    ? post.dones.includes(this.props.auth.user.uid)
                    : false
                }
                onPress={() =>
                  this.props.postAction(
                    "done",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
              <PostAction
                actionType={"like"}
                actionCount={post.likeCount}
                actionUser={
                  post.likes
                    ? post.likes.includes(this.props.auth.user.uid)
                    : false
                }
                onPress={() =>
                  this.props.postAction(
                    "like",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
            </View>
            <View style={styles.divider} />
          </View>
          <View style={styles.descriptionBox}>
            <Text style={styles.header}>description</Text>
            <FontBody text={post.description} />
          </View>
          {sharedBy.length > 0 ? (
            <View style={styles.actionByBox}>
              <Text style={styles.header}>shayred by</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sharedBy}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.actionByBox} />
          )}
          {addedBy.length > 0 ? (
            <View style={styles.actionByBox}>
              <Text style={styles.header}>added by</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {addedBy}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.actionByBox} />
          )}
          {donedBy.length > 0 ? (
            <View style={styles.actionByBox}>
              <Text style={styles.header}>read by</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {donedBy}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.actionByBox} />
          )}
          {likedBy.length > 0 ? (
            <View style={styles.actionByBox}>
              <Text style={styles.header}>liked by</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {likedBy}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.actionByBox} />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDetail);
