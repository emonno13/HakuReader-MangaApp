import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import firebase from "firebase";
import PostItem from "../screenchildren/PostItem";
import { SingleImage } from "react-native-zoom-lightbox";
// import Constants from 'expo-constants';
// import * as Permissions from 'expo-permissions';

const firebaseConfig = {
  apiKey: "AIzaSyD6Pu8lXsH6arl5eic4qhDHbmD1PfPfi8g",
  authDomain: "userauthentication-5e6c7.firebaseapp.com",
  databaseURL: "https://userauthentication-5e6c7.firebaseio.com",
  projectId: "userauthentication-5e6c7",
  storageBucket: "userauthentication-5e6c7.appspot.com",
  messagingSenderId: "601766894438",
  appId: "1:601766894438:web:bc8f9170c1311952ebc6a7",
  measurementId: "G-C7K2B934J0",
};
firebase.initializeApp(firebaseConfig);

const screenWidth = Math.round(Dimensions.get("window").width);
const defaultAvatar =
  "https://www.pngix.com/pngfile/middle/36-368059_20-anime-avatar-png-for-free-download-on.png";

export default class ForumScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postArray: [],
      newPost: "",
      save_value: "",
      avatar: defaultAvatar,
      loading: false,
    };
  }

  componentDidMount() {
    //Gọi ra màn hình data khi có thay đổi trên firebase, dùng hàm focus để cập nhập lại sreen hiện tại khi focus lại
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this._retrieveUserName().then(() => this.getAndLoadHttpUrl());
      firebase
        .database()
        .ref()
        .child("posts")
        .on("value", (childSnapshot) => {
          const posts = [];
          childSnapshot.forEach((doc) => {
            posts.push({
              key: doc.key,
              postAvatar: doc.toJSON().postAvatar,
              postUserName: doc.toJSON().postUserName,
              postContent: doc.toJSON().postContent,
              postTime: doc.toJSON().postTime,
              postContentImage: doc.toJSON().postContentImage,
            });
            this.setState({
              postArray: posts.sort((a, b) => {
                return a.postTime < b.postTime;
              }),
              loading: false,
            });
            //console.log(this.state.postArray);
          });
        });
    });
  }

  _retrieveUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");
      if (value !== null) {
        this.setState({ save_value: value });
      }
    } catch (error) {}
  };
  getAndLoadHttpUrl = async () => {
    const ref = await firebase
      .storage()
      .ref("UserAvatars/" + this.state.save_value);
    ref.getDownloadURL().then((data) => {
      this.setState({ avatar: data });
    });
    //Tránh lỗi gọi link ảnh của user mới ko tồn tại bằng cách đẩy ảnh lúc tạo lên storage luôn
  };
  gotoWriteMyPost = async () => {
    //Screen WritePostScreen sẽ nhận dc username và avatar của ForumScreen
    this.props.navigation.navigate("WriteMyPost", {
      username: this.state.save_value,
      avatar: this.state.avatar,
    });
  };
  static navigationOptions = {
    header: null,
  };

  //Post data to firebase
  // onAddItem = async () => {

  //   firebase.database().ref().child('posts').push({
  //     postName: this.state.newPost,
  //     postTime: Date().toLocaleString("en-US")
  //   }).then((data) => {
  //     console.log('data ', data)
  //   }).catch((error) => {
  //     console.log('error ', error)
  //   })

  // }

  gotoCommentList = async (time) => {
    //alert(result);
    this.props.navigation.navigate("Comment", {
      postTime: time,
      username: this.state.save_value,
      avatar: this.state.avatar,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle='light-content'
          hidden={false}
          backgroundColor='#C2185B'
          translucent={false}
        />

        <View style={styles.headInfo}>
          {/* <Image source={{ uri: this.state.avatar }} style={styles.avatar} /> */}

          <SingleImage uri={this.state.avatar} style={styles.avatar} />

          <TouchableOpacity
            style={styles.textInput}
            onPress={() => this.gotoWriteMyPost()}
          >
            <Text style={styles.contentInput}>What do you think ...</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.postList}>
          <FlatList
            data={this.state.postArray}
            renderItem={({ item }) => (
              // <Text>{item.postName}</Text>
              <PostItem
                item={item}
                gotoCommentList={() => this.gotoCommentList(item.postTime)}
              />
            )}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            style={styles.postArray}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffb3e2",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
  },
  headInfo: {
    flexDirection: "row",
    width: screenWidth,
    backgroundColor: "white",
    height: 80,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  avatar: {
    marginLeft: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  textInput: {
    justifyContent: "center",
    marginLeft: "5%",
    height: 40,
    width: "70%",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ffb3e2",
  },
  contentInput: {
    marginLeft: "2%",
    color: "grey",
  },
  postList: {
    width: "95%",
    // justifyContent:'center',
    // alignItems:'center'
  },
  postArray: {
    marginBottom: "5%",
    marginTop: "5%",
  },
});
