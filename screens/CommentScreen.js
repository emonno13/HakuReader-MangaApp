import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  Button,
  AsyncStorage,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import { firebaseConfig } from "../components/firebaseConfig";
import CommentItem from "../screenchildren/CommentItem";

export default class CommentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      commentArrays: [],
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      //Heading/title of the header
      title: "Create your comment",
      //Heading style
      headerStyle: {
        backgroundColor: "white",
      },
      //Heading text color
      headerTintColor: "black",
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => alert("Yo Yo")}
        >
          <FontAwesome name='share-square-o' size={32} color='black' />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      firebase
        .database()
        .ref()
        .child("posts")
        .orderByChild("postTime")
        .equalTo(this.props.navigation.getParam("postTime"))
        .on("child_added", (snapshot) => {
          firebase
            .database()
            .ref("posts/" + snapshot.key + "/postCommentList")
            .on("value", (childSnapshot) => {
              let comments = [];
              childSnapshot.forEach((doc) => {
                comments.push({
                  avatar: doc.toJSON().avatar,
                  username: doc.toJSON().username,
                  comment: doc.toJSON().comment,
                });
                //console.log(comments);
              });
              //console.log(comments);
              this.setState({ commentArrays: comments });
              //firebase.database().ref('posts/'+snapshot.key +'/postCommentList').off()
            });
        });
      // 'child_added' : để tìm key parent, 'value' là để read data, ko dùng function(snapshot) khi muốn this.setState
    });
  }

  onAddItem = async () => {
    // const rootRef = firebase.database().ref();
    // const usersRef = rootRef.child('posts');
    // const save_comment = this.state.comment;

    // usersRef.orderByChild('postTime').equalTo(this.props.navigation.getParam('postTime')).on('child_added', function(snapshot){
    //   firebase.database().ref('posts/'+snapshot.key).push({
    //       comment : save_comment
    //     });
    //   })

    const rootRef = firebase.database().ref();
    const usersRef = rootRef.child("posts");
    const save_comment = this.state.comment;
    const save_username = this.props.navigation.getParam("username");
    const save_avatar = this.props.navigation.getParam("avatar");

    usersRef
      .orderByChild("postTime")
      .equalTo(this.props.navigation.getParam("postTime"))
      .on("child_added", function (snapshot) {
        firebase
          .database()
          .ref("posts/" + snapshot.key + "/postCommentList/")
          .push({
            avatar: save_avatar,
            username: save_username,
            comment: save_comment,
          });
      });

    //cách 2 : child.child.child('post/') vào child của child
    // firebase.database().ref().child('posts').orderByChild('postTime').equalTo(this.props.navigation.getParam('postTime')).on('child_added',function(snapshot){
    //   firebase.database().ref('posts/'+snapshot.key +'/postCommentList/').on('child_added',function(snapshot1){
    //     firebase.database().ref('posts/'+snapshot.key +'/postCommentList/'+snapshot1.key).push({
    //       comment : save_comment
    //     })
    //   })
    // })
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
        // style={styles.container}
        // behavior='padding'
        // enabled
        // keyboardVerticalOffset={80}
      >
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* 
              <ScrollView style={styles.commentList}> */}
              <FlatList
                data={this.state.commentArrays}
                renderItem={({ item }) => <CommentItem item={item} />}
                numColumns={1}
                keyExtractor={(item, index) => index.toString()}
                style={styles.commentArrays}
              />
              {/* </ScrollView> */}

              <View style={styles.headerComment}>
                <Image
                  source={{ uri: this.props.navigation.getParam("avatar") }}
                  style={styles.avatarComment}
                />
                <TextInput
                  style={styles.textComment}
                  //underlineColorAndroid='white'
                  autoCapitalize='none'
                  placeholder='Leave comment'
                  placeholderTextColor='white'
                  multiline={true}
                  //textAlignVertical='top'
                  paddingLeft={10}
                  paddingRight={10}
                  onChangeText={(comment) => this.setState({ comment })}
                  value={this.state.comment}
                />
                <Button title='Post' onPress={() => this.onAddItem()} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    //paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  headerComment: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#827c80",
    width: "100%",
    // height:'10%'
  },
  avatarComment: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  textComment: {
    //height:40,
    width: "60%",
    color: "white",
    marginLeft: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
  },

  commentList: {
    width: "100%",
  },
  commentArrays: {
    marginBottom: "5%",
    marginTop: "5%",
  },
});
