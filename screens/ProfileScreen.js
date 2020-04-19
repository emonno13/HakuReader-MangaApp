import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Button,
  Alert,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SingleImage } from "react-native-zoom-lightbox";

import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { firebaseConfig } from "../components/firebaseConfig";

const defaultBackground =
  "http://getwallpapers.com/wallpaper/full/1/9/3/861434-top-anime-background-1920x1080-xiaomi.jpg";
const defaultAvatar =
  "https://www.pngix.com/pngfile/middle/36-368059_20-anime-avatar-png-for-free-download-on.png";
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class ProfileScreen extends Component {
  // _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      // isLoading:true,
      save_value: "",
      avatar: defaultAvatar,
      background: defaultBackground,
    };
  }

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      !firebase.apps.length
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app();
      this._retrieveUserName().then(() =>
        this.getPermissionAsync().then(() =>
          this.getAndLoadHttpUrl_Avatar().then(() =>
            this.getAndLoadHttpUrl_Background()
          )
        )
      );
    });
  };

  componentWillUnmount = async () => {
    // this.focusListener.remove();
    //this.focusListener.abort();
    // this._isMounted = false;
  };
  // Xóa data cũ sau thay đổi avatar khỏi hệ thống

  onLogoutPress = async () => {
    await AsyncStorage.clear();
    this.setState({ isLoading: false });
    this.props.navigation.navigate("Loading");
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  //////////////////////////////////////////////////////////// Take Avatar
  _pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [8, 8],
      quality: 1,
    });

    console.log(result.uri);

    if (!result.cancelled) {
      //this.setState({ avatar: result.uri });
      this.uploadAvatar(result.uri, this.state.save_value);
    }
  };

  uploadAvatar = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    //Đẩy ảnh lên Firebase Storage
    ref = firebase
      .storage()
      .ref()
      .child("UserAvatars/" + imageName)
      .put(blob)
      .then(function (snapshot) {
        console.log("Uploaded a blob or file!");
      })
      .then(() => {
        //Gọi link ảnh từ FirebaseStorage
        const getImageUrl = firebase.storage().ref("UserAvatars/" + imageName);
        getImageUrl
          .getDownloadURL()
          .then((data) => {
            this.setState({ avatar: data });
          })
          .then(() => {
            //Pass link ảnh sang Realtime Database
            const save_avatar = this.state.avatar;
            const rootRef = firebase.database().ref();
            const usersRef = rootRef.child("users");
            usersRef
              .orderByChild("username")
              .equalTo(this.state.save_value)
              .on("child_added", function (snapshot) {
                firebase
                  .database()
                  .ref("users/" + snapshot.key)
                  .update({
                    avatar: save_avatar,
                  });
                // alert('Your avatar was changed');
              });
          });
      });
  };

  getAndLoadHttpUrl_Avatar = async () => {
    // //Gọi avatar từ Firebase Storage
    const ref = await firebase
      .storage()
      .ref("UserAvatars/" + this.state.save_value);
    ref.getDownloadURL().then((data) => {
      this.setState({ avatar: data });
    });

    //Gọi avatar từ Realtime Database

    // const rootRef = firebase.database().ref();
    // const usersRef = rootRef.child('users');
    // usersRef.on('value', (snapshot) => {
    //   const users = [];
    //   snapshot.forEach((doc) => {
    //     users.push({
    //       avatar: doc.toJSON().avatar,
    //       username : doc.toJSON().username
    //     })
    //   })
    //   console.log(users);
    //   usersRef.off();
    //   for (var i = 0; i < users.length; i++) {
    //     if(this.state.save_value === users[i].username){
    //         console.log(users[i].avatar)
    //         this.setState({avatar:users[i].avatar })
    //     }
    //   }

    //   })
  };

  /////////////////////////////////////////////////////////////////////////////Take Background
  _pickBackground = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [8, 8],
      quality: 1,
    });

    console.log(result.uri);

    if (!result.cancelled) {
      //this.setState({ avatar: result.uri });
      this.uploadBackground(result.uri, this.state.save_value);
    }
  };

  uploadBackground = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    //Đẩy ảnh lên Firebase Storage
    ref = firebase
      .storage()
      .ref()
      .child("UserBackgrounds/" + imageName)
      .put(blob)
      .then(function (snapshot) {
        console.log("Uploaded a blob or file!");
      })
      .then(() => {
        //Gọi link ảnh từ FirebaseStorage
        const getImageUrl = firebase
          .storage()
          .ref("UserBackgrounds/" + imageName);
        getImageUrl
          .getDownloadURL()
          .then((data) => {
            this.setState({ background: data });
          })
          .then(() => {
            //Pass link ảnh sang Realtime Database
            const save_background = this.state.background;
            const rootRef = firebase.database().ref();
            const usersRef = rootRef.child("users");
            usersRef
              .orderByChild("username")
              .equalTo(this.state.save_value)
              .on("child_added", function (snapshot) {
                firebase
                  .database()
                  .ref("users/" + snapshot.key)
                  .update({
                    background: save_background,
                  });
                // alert('Your avatar was changed');
              });
          });
      });
  };

  getAndLoadHttpUrl_Background = async () => {
    // //Gọi avatar từ Firebase Storage
    const ref = await firebase
      .storage()
      .ref("UserBackgrounds/" + this.state.save_value);
    ref.getDownloadURL().then((data) => {
      this.setState({ background: data });
    });

    //Gọi avatar từ Realtime Database

    // const rootRef = firebase.database().ref();
    // const usersRef = rootRef.child('users');
    // usersRef.on('value', (snapshot) => {
    //   const users = [];
    //   snapshot.forEach((doc) => {
    //     users.push({
    //       background: doc.toJSON().background,
    //       username : doc.toJSON().username
    //     })
    //   })
    //   console.log(users);
    //   usersRef.off();
    //   for (var i = 0; i < users.length; i++) {
    //     if(this.state.save_value === users[i].username){
    //        // console.log(users[i].avatar)
    //         this.setState({background:users[i].background })
    //     }
    //   }

    //   })
  };

  _retrieveUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");
      if (value !== null) {
        this.setState({ save_value: value });
      }
    } catch (error) {
      // Error retrieving data   } };
    }
  };

  // Style cho header của tab
  static navigationOptions = {
    header: null,
    // title: 'Profile',
    // // headerStyle: {
    // //   backgroundColor: '#f4511e',
    // // },
    // headerBackground: (
    //   <Image
    //     style={{ width: '100%', height: '100%' }}
    //     source={{ uri: 'https://i.pinimg.com/originals/3c/7a/fc/3c7afc1b68c0f8cc367dd9d0f1f383de.jpg' }}
    //   />
    // ),
    // headerStyle: {
    //   height: '35%',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
  };

  render() {
    return (
      <SafeAreaView style={styles.areaView}>
        <StatusBar
          barStyle='light-content'
          hidden={false}
          backgroundColor='#C2185B'
          translucent={false}
        />
        <View style={styles.container}>
          <Image
            source={{ uri: this.state.background }}
            style={styles.backgroundProfile}
          />

          <ScrollView style={styles.container}>
            <TouchableOpacity
              style={styles.buttonTakeBackground}
              onPress={() => this._pickBackground()}
            >
              <Feather name='camera' size={40} color='white' />
            </TouchableOpacity>

            {/* <Image source={{ uri: this.state.avatar }} style={styles.avatarProfile} /> */}
            <View style={styles.avatarWrapper}>
              <SingleImage
                uri={this.state.avatar}
                style={styles.avatarContent}
              />
            </View>

            <View style={styles.groupContent}>
              <Text style={styles.userName}>{this.state.save_value}</Text>

              <View style={styles.groupButtonTwice}>
                <TouchableOpacity onPress={() => this._pickAvatar()}>
                  <LinearGradient
                    colors={["#ed4781", "rgb(71,113,246)"]}
                    style={styles.ButtonTwice}
                  >
                    <Text style={styles.buttonTwiceText}>Change avatar</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onLogoutPress()}>
                  <LinearGradient
                    colors={["#ed4781", "rgb(71,113,246)"]}
                    style={styles.ButtonTwice}
                  >
                    <Text style={styles.buttonTwiceText}>Log Out</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  backgroundProfile: {
    width: screenWidth,
    height: screenHeight / 2 - 10,
    //resizeMode:'contain',
    backgroundColor: "grey",
    position: "absolute",
    //zIndex:-2
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  buttonTakeBackground: {
    height: 50,
    width: 50,
    marginLeft: screenWidth - 60,
    marginTop: screenHeight / 2 - 70,
    //backgroundColor:'orange',
    position: "absolute",
    zIndex: 5,
  },
  avatarWrapper: {
    height: screenWidth / 2,
    width: screenWidth / 2,
    borderRadius: screenWidth / 4,
    //backgroundColor:'blue',
    marginTop: screenHeight / 2 - screenWidth / 4,
    marginHorizontal: screenWidth / 2 - screenWidth / 4,
    position: "absolute",
    zIndex: 5,
    borderColor: "white",
    borderWidth: 0,

    justifyContent: "center",
    alignItems: "center",
  },
  avatarContent: {
    height: screenWidth / 2,
    width: screenWidth / 2,
    borderRadius: screenWidth / 4,
    borderWidth: 5,
    borderColor: "white",
  },
  groupContent: {
    //justifyContent:'center', dọc
    alignItems: "center",
    backgroundColor: "black",
    width: screenWidth,
    height: screenHeight + screenWidth / 4,
    marginTop: screenHeight / 2,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  userName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginTop: screenWidth / 4 + 50,
  },
  groupButtonTwice: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: screenWidth,
    marginTop: 40,
  },

  ButtonTwice: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
    borderRadius: 50,
  },
  buttonTwiceText: {
    color: "white",
    fontWeight: "200",
    fontStyle: "italic",
  },
});

// import React, { Component } from 'react';
// import{View,StyleSheet} from 'react-native';

// const styles = StyleSheet.create({
//     wrapper: {
//         flex:1,
//     },
//     back: {
//         width: 100,
//         height: 100,
//         backgroundColor: 'blue',
//         zIndex: 0
//     },
//     front: {
//         position: 'absolute',
//         top:25,
//         left:25,
//         width: 50,
//         height:50,
//         backgroundColor: 'red',
//         zIndex: 1
//     }
// });

// export default class Layers extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <View style={styles.wrapper}>
//                 <View style={styles.back}></View>
//                 <View style={styles.front}></View>
//             </View>
//         );
//     }
// }
