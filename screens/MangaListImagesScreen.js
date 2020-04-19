import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import * as firebase from "firebase";
import { firebaseConfig } from "../components/firebaseConfig";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class MangaListImagesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesList: [],
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      //Heading/title of the header
      title: "Manga",
      //Heading style
      headerStyle: {
        backgroundColor: "white",
      },
      //Heading text color
      headerTintColor: "black",
    };
  };
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      !firebase.apps.length
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app();

      //console.log(this.props.navigation.getParam('data').title +''+this.props.navigation.getParam('data').name)
      var listImagesLength = Object.keys(
        this.props.navigation.getParam("data").list
      ).length;

      const listInfo = [];
      for (var i = 0; i < listImagesLength; i++) {
        listInfo.push({
          paper: this.props.navigation.getParam("data").list[i],
        });
      }
      //console.log(listInfo);
      this.setState({ imagesList: listInfo });

      const comic_title = this.props.navigation.getParam("data").title;
      const comic_chapter_name = this.props.navigation.getParam("data").name;
      const rootRef = firebase.database().ref();
      const usersRef = rootRef.child("users");

      usersRef
        .orderByChild("username")
        .equalTo(this.props.navigation.getParam("username"))
        .on("child_added", function (snapshot) {
          firebase
            .database()
            .ref("users/" + snapshot.key + "/history/")
            .push({
              comic_chapter_name: comic_chapter_name,
              comic_name: comic_title,
              time_reading: Date().toLocaleString("en-US"),
            });
          usersRef.off();
        });
    });
  };
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View>
          <FlatList
            data={this.state.imagesList}
            renderItem={({ item }) => (
              <Image
                style={{
                  resizeMode: "stretch",
                  width: screenWidth,
                  height: screenHeight,
                  marginVertical: 10,
                }}
                source={{ uri: item.paper }}
              />
            )}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            style={{ backgroundColor: "black" }}
          />
        </View>

        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "white",
            backgroundColor: "black",
            textAlign: "center",
          }}
        >
          - END -
        </Text>
      </ScrollView>
    );
  }
}
