import React from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NavigationActions, DrawerActions } from "react-navigation";
import { SingleImage } from "react-native-zoom-lightbox";
import PropTypes from "prop-types";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as firebase from "firebase";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
//import{firebaseConfig} from '../components/firebaseConfig';
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
// firebase.initializeApp(firebaseConfig)

const defaultAvatar =
  "https://www.pngix.com/pngfile/middle/36-368059_20-anime-avatar-png-for-free-download-on.png";
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      save_value: "",
      avatar: defaultAvatar,
    };
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      !firebase.apps.length
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app();
      this._retrieveUserName().then(() =>
        this.getPermissionAsync().then(() => this.getAndLoadHttpUrl_Avatar())
      );
    });
  };

  _retrieveUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");
      //console.log(value);
      if (value !== null) {
        this.setState({ save_value: value });
        // console.log(this.state.save_value)
      } else {
      }
    } catch (error) {
      // Error retrieving data   } };
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  getAndLoadHttpUrl_Avatar = async () => {
    // //Gọi avatar từ Firebase Storage
    const ref = await firebase
      .storage()
      .ref("UserAvatars/" + this.state.save_value);
    ref.getDownloadURL().then((data) => {
      this.setState({ avatar: data });
    });
  };

  navigateToScreen = (route) => () => {
    const navigateActions = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateActions);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  onLogoutPress = async () => {
    await AsyncStorage.clear();
    this.setState({ isLoading: false });
    this.props.navigation.navigate("Loading");
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollview}>
        <ImageBackground
          style={styles.ImageBackground}
          resizeMode='stretch'
          source={require("../assets/images/home-pink.png")}
        >
          <StatusBar
            barStyle='light-content'
            hidden={false}
            backgroundColor='#C2185B'
            translucent={false}
          />
          <ImageBackground
            source={{
              uri:
                "https://backgrounddownload.com/wp-content/uploads/2018/09/anime-background-night-4.jpg",
            }}
            style={styles.avatarBackground}
          >
            {/* <Image source={{ uri: this.state.avatar }} style={styles.avatar} /> */}
            <SingleImage uri={this.state.avatar} style={styles.avatar} />

            {/* <Text style={styles.textButton}>{this.state.save_value}</Text> */}
          </ImageBackground>

          <TouchableOpacity
            style={styles.Button}
            onPress={this.navigateToScreen("Home")}
          >
            <AntDesign
              name='home'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={this.navigateToScreen("Category")}
          >
            <MaterialIcons
              name='local-library'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>CATEGORY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={this.navigateToScreen("Forum")}
          >
            <Ionicons
              name='ios-people'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>FORUM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={this.navigateToScreen("Profile")}
          >
            <FontAwesome
              name='user'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={this.navigateToScreen("Bookmark")}
          >
            <MaterialIcons
              name='favorite'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>FAVORITE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={this.navigateToScreen("Bookmark")}
          >
            <FontAwesome
              name='history'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>HISTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => this.onLogoutPress()}
          >
            <SimpleLineIcons
              name='logout'
              color='white'
              size={25}
              style={styles.iconButton}
            />
            <Text style={styles.textButton}>LOG OUT</Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    );
  }
}

Drawer.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  ImageBackground: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
  },
  scrollview: {
    flex: 1,
  },
  avatarBackground: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    marginVertical: 40,
    marginHorizontal: 20,
    width: screenWidth / 2,
    height: screenWidth / 2,
    borderRadius: screenWidth / 2,
    resizeMode: "cover",
    borderWidth: 10,
    borderColor: "white",
  },
  Button: {
    flexDirection: "row",
    marginVertical: 10,
  },
  iconButton: {
    marginHorizontal: 20,
  },
  textButton: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
});
