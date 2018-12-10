import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
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
    // this.props.navigation.setParams({
    //   navBack: this.props.navBack,
    // });
  }

  componentWillUnmount() {
    // for (var subscription in this.subscriptions) {
    //   if (this.subscriptions.hasOwnProperty(subscription)) {
    //     this.subscriptions[subscription]();
    //   }
    // }
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    let testActions = [
      <ActionCounter
        actionType={"share"}
        actionCount={1}
        actionUser
        onTap={() => console.log("action counter tap")}
      />,
      <ActionCounter
        actionType={"add"}
        actionCount={1}
        actionUser
        onTap={() => console.log("action counter tap")}
      />
    ];
    testActions = null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.contentBox}
            onPress={() => console.log("touch me")}
          >
            <PostImage view="detail" />
            <PostContext
              title="lsakdjlfkjs"
              publisher="lsakdjlfkjs"
              actions={testActions}
            />
          </TouchableOpacity>
          <View style={styles.dividerBox}>
            <View style={styles.divider} />
            <View style={styles.actionBox}>
              <ActionCounter
                actionType={"share"}
                actionCount={1}
                actionUser
                onTap={() => console.log("action counter tap")}
              />
              <ActionCounter
                actionType={"add"}
                actionCount={1}
                actionUser
                onTap={() => console.log("action counter tap")}
              />
              <ActionCounter
                actionType={"done"}
                actionCount={1}
                actionUser
                onTap={() => console.log("action counter tap")}
              />
              <ActionCounter
                actionType={"like"}
                actionCount={1}
                actionUser
                onTap={() => console.log("action counter tap")}
              />
            </View>
            <View style={styles.divider} />
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.header}>summary</Text>
            <Text style={styles.body}>
              This week, Alex receives feedback about his job performance from
              his co-workers, friends, and family. Some of it is good, some less
              so. But there is something else that comes up during the review
              process that shocks him. We explore what happens when you unpack
              your emotional baggage—or someone unpacks it for you—and you
              realize the unexpected effect that it has been having on your
              team. In this final Gimlet-focused episode of season four, we take
              a raw and intimate look at a defining moment in the trajectory of
              a CEO.
            </Text>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>shayred by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.header}>shayred by</Text>
              <Text style={styles.header}>shayred by</Text>
              <Text style={styles.header}>shayred by</Text>
            </ScrollView>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>added by</Text>
            <Text style={styles.body}>
              This week, Alex receives feedback about his job performance from
              his co-workers, friends, and family. Some of it is good, some less
              so. But there is something else that comes up during the review
              process that shocks him. We explore what happens when you unpack
              your emotional baggage—or someone unpacks it for you—and you
              realize the unexpected effect that it has been having on your
              team. In this final Gimlet-focused episode of season four, we take
              a raw and intimate look at a defining moment in the trajectory of
              a CEO.
            </Text>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>read by</Text>
            <Text style={styles.body}>
              This week, Alex receives feedback about his job performance from
              his co-workers, friends, and family. Some of it is good, some less
              so. But there is something else that comes up during the review
              process that shocks him. We explore what happens when you unpack
              your emotional baggage—or someone unpacks it for you—and you
              realize the unexpected effect that it has been having on your
              team. In this final Gimlet-focused episode of season four, we take
              a raw and intimate look at a defining moment in the trajectory of
              a CEO.
            </Text>
          </View>
          <View style={styles.actionByBox}>
            <Text style={styles.header}>liked by</Text>
            <Text style={styles.body}>
              This week, Alex receives feedback about his job performance from
              his co-workers, friends, and family. Some of it is good, some less
              so. But there is something else that comes up during the review
              process that shocks him. We explore what happens when you unpack
              your emotional baggage—or someone unpacks it for you—and you
              realize the unexpected effect that it has been having on your
              team. In this final Gimlet-focused episode of season four, we take
              a raw and intimate look at a defining moment in the trajectory of
              a CEO.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDetails);
