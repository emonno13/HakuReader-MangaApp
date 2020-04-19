import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  PixelRatio,
  StatusBar,
  Platform,
} from "react-native";
import firebase from "firebase";
import { firebaseConfig } from "../components/firebaseConfig";
import BookmarkItem from "../screenchildren/BookmarkItem";

export default class BookmarkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      save_value: "",
      favoriteGroups: [],
      historyArrays: [],
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount = async () => {
    console.log(this.state.save_value);
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      !firebase.apps.length
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app();
      this._retrieveUserName().then(() =>
        this.getBookmark().then(() => this.getHistory())
      );
    });
  };

  _retrieveUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");
      if (value !== null) {
        this.setState({ save_value: value });
      }
    } catch (error) {}
  };

  getBookmark = async () => {
    const favoriteArrays = [];
    const rootRef = firebase.database().ref();
    const usersRef = rootRef.child("users");

    //Gọi những truyện ưa thích
    usersRef
      .orderByChild("username")
      .equalTo(this.state.save_value)
      .on("child_added", (childSnapshot) => {
        firebase
          .database()
          .ref("users/" + childSnapshot.key + "/favorite")
          .on("value", function (snapshot) {
            // let favoriteArrays = []
            snapshot.forEach((doc) => {
              favoriteArrays.push({
                key: doc.toJSON().key,
                imgSrc: doc.toJSON().imgSrc,
                title: doc.toJSON().comic_name,
              });
            });
            // this.setState({favoriteGroups: favoriteArrays})
            //console.log(favoriteArrays);
            // console.log(Object.keys(favoriteArrays).length)
            usersRef.off();
          });
        //console.log(favoriteArrays);

        this.setState({
          favoriteGroups: favoriteArrays.sort((a, b) => {
            return a.key < b.key;
          }),
        });
        //console.log(Object.keys(this.state.favoriteGroups).length)
        usersRef.off();
      });
  };
  getHistory = async () => {
    const historyArrays = [];
    const rootRef = firebase.database().ref();
    const usersRef = rootRef.child("users");

    //Gọi những tập truyện đã xem
    usersRef
      .orderByChild("username")
      .equalTo(this.state.save_value)
      .on("child_added", (childSnapshot) => {
        firebase
          .database()
          .ref("users/" + childSnapshot.key + "/history")
          .on("value", function (snapshot) {
            // let favoriteArrays = []
            snapshot.forEach((doc) => {
              historyArrays.push({
                comic_chapter_name: doc.toJSON().comic_chapter_name,
                comic_name: doc.toJSON().comic_name,
                time_reading: doc.toJSON().time_reading,
              });
            });
            // this.setState({favoriteGroups: favoriteArrays})
            //console.log(favoriteArrays);
            // console.log(Object.keys(favoriteArrays).length)
            usersRef.off();
          });
        console.log(historyArrays);

        this.setState({
          historyArrays: historyArrays.sort((a, b) => {
            return a.time_reading < b.time_reading;
          }),
        });
        //console.log(Object.keys(this.state.favoriteGroups).length)
        usersRef.off();
      });
  };

  render() {
    return (
      <ImageBackground
        style={styles.ImageBackground}
        resizeMode='stretch'
        source={require("../assets/images/home-dark.png")}
      >
        <StatusBar
          barStyle='light-content'
          hidden={false}
          backgroundColor='#C2185B'
          translucent={false}
        />
        <ScrollView style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              marginVertical: 20,
              color: "white",
              marginLeft: 10,
            }}
          >
            MY FAVORITE
          </Text>
          <FlatList
            data={this.state.favoriteGroups}
            renderItem={({ item }) => <BookmarkItem item={item} />}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
          />

          <Text
            style={{
              fontSize: 20,
              marginVertical: 20,
              color: "white",
              marginLeft: 10,
            }}
          >
            MY HISTORY
          </Text>
          <FlatList
            data={this.state.historyArrays}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "white",
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}
              >
                <Text>{item.comic_name}</Text>
                <Text>{item.comic_chapter_name}</Text>
                <Text>{item.time_reading.replace(" GMT+0700 (+07)", "")}</Text>
              </View>
            )}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageBackground: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
  },
});
