import React, { Component, PureComponent } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { ENTRIES1 } from "../constants/entries";
import Carousel1 from "../components/Carousel1";
import { SearchBar } from "react-native-elements";
import LastUpdatedItem from "../screenchildren/LastUpdatedItem";
import firebase from "firebase";

// const save_value = '';
export default class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      save_value: "",
      data1: ENTRIES1,
      bookArray: [],
      bookArrayLastUpdated: [],
      bookArrayTopTrending: [],
      search: "",
    };
    this.onScroll = this.onScroll.bind(this);
    this._retrieveUserName();
  }
  _retrieveUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");
      if (value !== null) {
        //console.log('Retrieve:'+value);
        this.setState({ save_value: value });
        //console.log('State:'+this.state.save_value)
      }
    } catch (error) {
      // Error retrieving data   } };
    }
  };

  // Style cho header của tab
  static navigationOptions = {
    header: null,
  };

  //Gọi danh sách truyện tranh xuống
  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      firebase
        .database()
        .ref()
        .child("books")
        .on("value", (childSnapshot) => {
          //Tạo mảng danh sách truyện tất cả
          const books = [];
          childSnapshot.forEach((doc) => {
            books.push({
              key: doc.key,
              title: doc.toJSON().title,
              author: doc.toJSON().author,
              kind: doc.toJSON().kind,
              status: doc.toJSON().status,
              content: doc.toJSON().content,
              imgSrc: doc.toJSON().imgSrc,
              numOfViews: doc.toJSON().numOfViews,
              numOfFollowers: doc.toJSON().numOfFollowers,
              numOfRatings: doc.toJSON().numOfRatings,
              rating: doc.toJSON().rating,
              chapters: doc.toJSON().chapters,
            });
          });
          this.setState({ bookArray: books });
          //console.log(books.chapters);

          //Tạo mảng danh sách truyện Top Trending - dựa trên số người theo dõi - top 5 comics / numofFollowers
          const groupNumOfFollowers = [];
          for (var i = 0; i < books.length; i++) {
            groupNumOfFollowers.push({
              numOfFollowers: books[i].numOfFollowers,
            });
          }
          const top_5_groupNumOfFollowers = groupNumOfFollowers
            .sort((a, b) => {
              return a.numOfFollowers < b.numOfFollowers;
            })
            .slice(0, 5);
          //console.log(top_5_groupNumOfFollowers);

          const booksTopTrending = [];
          for (var i = 0; i < books.length; i++) {
            for (var k = 0; k < top_5_groupNumOfFollowers.length; k++) {
              if (
                books[i].numOfFollowers ===
                top_5_groupNumOfFollowers[k].numOfFollowers
              ) {
                booksTopTrending.push({
                  title: books[i].title,
                  author: books[i].author,
                  kind: books[i].kind,
                  status: books[i].status,
                  content: books[i].content,
                  imgSrc: books[i].imgSrc,
                  numOfViews: books[i].numOfViews,
                  numOfFollowers: books[i].numOfFollowers,
                  numOfRatings: books[i].numOfRatings,
                  rating: books[i].rating,
                  chapters: books[i].chapters,
                });
              }
            }
          }
          //console.log(booksTopTrending);
          this.setState({ bookArrayTopTrending: booksTopTrending });

          //Tạo mảng danh sách truyện Last Updated - dựa trên tình trạng Ongoing
          const booksLastUpdated = [];
          for (var i = 0; i < books.length; i++) {
            if (books[i].status === "Ongoing") {
              booksLastUpdated.push({
                title: books[i].title,
                author: books[i].author,
                kind: books[i].kind,
                status: books[i].status,
                content: books[i].content,
                imgSrc: books[i].imgSrc,
                numOfViews: books[i].numOfViews,
                numOfFollowers: books[i].numOfFollowers,
                numOfRatings: books[i].numOfRatings,
                rating: books[i].rating,
                chapters: books[i].chapters,
              });
            }
          }
          //console.log(booksLastUpdated);
          this.setState({ bookArrayLastUpdated: booksLastUpdated });
        });
    });
  };
  updateSearch = (search) => {
    this.setState({ search });
  };

  gotoMangaScreen = (item) => {
    //alert('manga screen');
    this.props.navigation.navigate("Manga", {
      data: item,
      username: this.state.save_value,
    });
    //console.log(item);
  };

  onScroll = (event) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    const height = 0;
    const shouldShowTabBar = scrollOffsetY > height ? true : false;
    const direction = scrollOffsetY > height ? "down" : "up";
    //console.log('scroll direction ' + direction);
    //console.log('setting visible:', shouldShowTabBar);
    this.props.navigation.setParams({ tabBarVisible: shouldShowTabBar });
  };

  render() {
    return (
      <ImageBackground
        style={styles.ImageBackground}
        resizeMode='stretch'
        source={require("../assets/images/home-purple.png")}
      >
        <StatusBar
          barStyle='light-content'
          hidden={false}
          backgroundColor='#C2185B'
          translucent={false}
        />
        <ScrollView style={styles.container} onScrollBeginDrag={this.onScroll}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.welcome}>Welcome {this.state.save_value}</Text>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
              onPress={this.props.navigation.openDrawer}
            >
              <Ionicons name='ios-menu' color='white' size={50} />
            </TouchableOpacity>
          </View>

          <SearchBar
            placeholder='Search'
            onChangeText={this.updateSearch}
            value={this.state.search}
            containerStyle={{
              backgroundColor: "transparent",
              borderColor: "white",
              borderRadius: 10,
              borderWidth: 0,
              marginHorizontal: 10,
            }}
            inputContainerStyle={{ backgroundColor: "white", borderRadius: 20 }}
            lightTheme={null}
          />

          <Text style={styles.welcome}>Top Trending</Text>
          <Carousel1
            data1={this.state.bookArrayTopTrending}
            style={styles.carousel}
            gotoManga={this.gotoMangaScreen}
          />

          <Text style={styles.welcome}>Last Updated</Text>
          <View style={styles.groupLastUpdated}>
            <FlatList
              data={this.state.bookArrayLastUpdated}
              renderItem={({ item }) => (
                <LastUpdatedItem item={item} gotoManga={this.gotoMangaScreen} />
              )}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              style={styles.LastUpdatedItem}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:'center',
    // alignItems:'center'
  },
  ImageBackground: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
    // width:'100%',
    // height:'100%'
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    marginVertical: 10,
  },
  carousel: {
    backgroundColor: "green",
  },
  groupLastUpdated: {
    // marginBottom:20
  },
});
