import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native";
import firebase from "firebase";
import CategoryItem from "../screenchildren/CategoryItem";
import { SearchBar } from "react-native-elements";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
export default class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookArray: [],
      bookArray_by_kind: [],
      booktypesArray: [],
      booktypesName: "All",
      booktypes_button_color: "white",
      search: "",
      save_value: "",
    };
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

  static navigationOptions = {
    header: null,
  };

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      firebase
        .database()
        .ref()
        .child("book-types")
        .on("value", (childSnapshot) => {
          const booktypes = [];
          childSnapshot.forEach((doc) => {
            booktypes.push({
              key: doc.key,
              booktype: doc.toJSON(),
            });
          });

          firebase.database().ref().child("book-types").off();
          this.setState({ booktypesArray: booktypes });
          //console.log(this.state.booktypesArray);
        });

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
          this.setState({ bookArray: books, bookArray_by_kind: books });

          firebase.database().ref().child("books").off();
        });
    });
  };

  search = (text) => {
    console.log(text);
  };

  clear = () => {
    this.search.clear();
  };

  SearchFilterFunction(text) {
    const book_by_kinds = [];
    for (var i = 0; i < this.state.bookArray.length; i++) {
      if (this.state.bookArray[i].kind.includes(this.state.booktypesName)) {
        book_by_kinds.push({
          title: this.state.bookArray[i].title,
          author: this.state.bookArray[i].author,
          kind: this.state.bookArray[i].kind,
          status: this.state.bookArray[i].status,
          content: this.state.bookArray[i].content,
          imgSrc: this.state.bookArray[i].imgSrc,
          numOfViews: this.state.bookArray[i].numOfViews,
          numOfFollowers: this.state.bookArray[i].numOfFollowers,
          numOfRatings: this.state.bookArray[i].numOfRatings,
          rating: this.state.bookArray[i].rating,
          chapters: this.state.bookArray[i].chapters,
        });
      } else if (this.state.booktypesName === "All") {
        book_by_kinds.push({
          title: this.state.bookArray[i].title,
          author: this.state.bookArray[i].author,
          kind: this.state.bookArray[i].kind,
          status: this.state.bookArray[i].status,
          content: this.state.bookArray[i].content,
          imgSrc: this.state.bookArray[i].imgSrc,
          numOfViews: this.state.bookArray[i].numOfViews,
          numOfFollowers: this.state.bookArray[i].numOfFollowers,
          numOfRatings: this.state.bookArray[i].numOfRatings,
          rating: this.state.bookArray[i].rating,
          chapters: this.state.bookArray[i].chapters,
        });
      }
    }

    const newData = book_by_kinds.filter(function (item) {
      const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      bookArray_by_kind: newData,
      search: text,
    });
  }

  changeBookTypes = async (data) => {
    await this.setState({ booktypesName: data });
    console.log(this.state.booktypesName);
    //console.log(this.state.bookArray)

    const book_by_kinds = [];
    for (var i = 0; i < this.state.bookArray.length; i++) {
      if (this.state.bookArray[i].kind.includes(this.state.booktypesName)) {
        book_by_kinds.push({
          title: this.state.bookArray[i].title,
          author: this.state.bookArray[i].author,
          kind: this.state.bookArray[i].kind,
          status: this.state.bookArray[i].status,
          content: this.state.bookArray[i].content,
          imgSrc: this.state.bookArray[i].imgSrc,
          numOfViews: this.state.bookArray[i].numOfViews,
          numOfFollowers: this.state.bookArray[i].numOfFollowers,
          numOfRatings: this.state.bookArray[i].numOfRatings,
          rating: this.state.bookArray[i].rating,
          chapters: this.state.bookArray[i].chapters,
        });
      } else if (this.state.booktypesName === "All") {
        book_by_kinds.push({
          title: this.state.bookArray[i].title,
          author: this.state.bookArray[i].author,
          kind: this.state.bookArray[i].kind,
          status: this.state.bookArray[i].status,
          content: this.state.bookArray[i].content,
          imgSrc: this.state.bookArray[i].imgSrc,
          numOfViews: this.state.bookArray[i].numOfViews,
          numOfFollowers: this.state.bookArray[i].numOfFollowers,
          numOfRatings: this.state.bookArray[i].numOfRatings,
          rating: this.state.bookArray[i].rating,
          chapters: this.state.bookArray[i].chapters,
        });
      }
    }
    this.setState({ bookArray_by_kind: book_by_kinds });
  };

  gotoMangaScreen = (item) => {
    //alert('manga screen');
    this.props.navigation.navigate("Manga", {
      data: item,
      username: this.state.save_value,
    });
    //console.log(item);
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
        <View style={styles.container}>
          <View style={{ width: screenWidth, marginTop: 20 }}>
            <FlatList
              data={this.state.booktypesArray}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: this.state.booktypes_button_color,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.changeBookTypes(item.booktype)}
                >
                  <Text
                    style={{
                      color: "purple",
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}
                  >
                    {item.booktype}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              style={{ backgroundColor: "transparent" }}
            />
          </View>

          <View
            style={{
              width: screenWidth,
              marginVertical: 10,
              paddingBottom: 120,
            }}
          >
            <SearchBar
              round
              searchIcon={{ size: 24 }}
              onChangeText={(text) => this.SearchFilterFunction(text)}
              onClear={(text) => this.SearchFilterFunction("")}
              placeholder='Search'
              value={this.state.search}
              containerStyle={{
                backgroundColor: "transparent",
                borderColor: "white",
                borderRadius: 10,
                borderWidth: 0,
                marginHorizontal: 10,
              }}
              inputContainerStyle={{
                backgroundColor: "white",
                borderRadius: 20,
              }}
              lightTheme={null}
            />
            <FlatList
              data={this.state.bookArray_by_kind}
              renderItem={({ item }) => (
                <CategoryItem item={item} gotoManga={this.gotoMangaScreen} />
              )}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              style={{}}
            />
          </View>
        </View>
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
});

// static navigationOptions = {
//   title: 'Category',
//   // headerStyle: {
//   //   backgroundColor: '#f4511e',
//   // },
//   headerBackground: (
//     <Image
//       style={{width: '100%', height: '100%'}}
//       source={{uri: 'https://i.pinimg.com/originals/3c/7a/fc/3c7afc1b68c0f8cc367dd9d0f1f383de.jpg'}}
//     />
//   ),
//   headerStyle:{
//     height:'35%',
//   },
//   headerTintColor: '#fff',
//   headerTitleStyle: {
//     fontWeight: 'bold',
//   },
// };
