import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  postAction,
  postDetailsBack
} from "../../redux/postActions/PostActionsActions";
import HeaderBar from "../../components/HeaderBar";
import { colors } from "../../styles/Colors";
import styles from "./styles";
import PostImage from "../../components/PostImage";
import PostContext from "../../components/PostContext";
import ActionCounter from "../../components/ActionCounter";
import ProfileIcon from "../../components/ProfileIcon";
import { openURL } from "../../lib/Utils";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    postActions: state.postActions,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => ({
  navBack: () => dispatch(postDetailsBack()),
  postAction: (actionType, userId, postId) =>
    dispatch(postAction(actionType, userId, postId))
});

class PostDetails extends Component {
  // static propTypes = {
  //   postImage: ,
  //   postContext: ,
  //   actions: ,
  //   description: ,
  //   sharedBy: ,
  //   addedBy: ,
  //   readBy: ,
  //   likedBy: ,
  //   navBack: ,
  // };

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderBar
          backgroundColor={colors.WHITE}
          statusBarStyle="dark-content"
          title=""
          back={() => navigation.state.params.navBack()}
        />
      )
    };
  };

  componentDidMount() {
    // this.subscriptions.push();
    this.props.navigation.setParams({
      navBack: this.props.navBack
    });
  }

  componentWillUnmount() {
    // for (var subscription in this.subscriptions) {
    //   if (this.subscriptions.hasOwnProperty(subscription)) {
    //     this.subscriptions[subscription]();
    //   }
    // }
  }

  render() {
    if (!this.props.postActions.postDetail) {
      return <View style={styles.container} />;
    }

    console.log(this.props);
    const { ...post } = { ...this.props.postActions.postDetail };
    console.log(post);

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
              <ActionCounter
                actionType={"share"}
                actionCount={post.shareCount}
                actionUser={
                  post.shares
                    ? post.shares.includes(this.props.auth.user.uid)
                    : false
                }
                onTap={() =>
                  this.props.postAction(
                    "share",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
              <ActionCounter
                actionType={"add"}
                actionCount={post.addCount}
                actionUser={
                  post.adds
                    ? post.adds.includes(this.props.auth.user.uid)
                    : false
                }
                onTap={() =>
                  this.props.postAction(
                    "add",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
              <ActionCounter
                actionType={"done"}
                actionCount={post.doneCount}
                actionUser={
                  post.dones
                    ? post.dones.includes(this.props.auth.user.uid)
                    : false
                }
                onTap={() =>
                  this.props.postAction(
                    "done",
                    this.props.auth.user.uid,
                    post.postId
                  )
                }
              />
              <ActionCounter
                actionType={"like"}
                actionCount={post.likeCount}
                actionUser={
                  post.likes
                    ? post.likes.includes(this.props.auth.user.uid)
                    : false
                }
                onTap={() =>
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
            <Text style={styles.body}>{post.description}</Text>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>shayred by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sara.skdmflskdjlkfah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saa.skdlfkjlaskrah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saralksjdlkah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
            </ScrollView>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>added by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sara.skdmflskdjlkfah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saa.skdlfkjlaskrah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saralksjdlkah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
            </ScrollView>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>read by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sara.skdmflskdjlkfah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saa.skdlfkjlaskrah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saralksjdlkah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
            </ScrollView>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>liked by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sara.skdmflskdjlkfah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saa.skdlfkjlaskrah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Saralksjdlkah"}
                lastName={"Buttons"}
              />
              <ProfileIcon
                view={"large"}
                uri={"https://graph.facebook.com/255045858399396/picture"}
                firstName={"Sarah"}
                lastName={"Buttons"}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDetails);
