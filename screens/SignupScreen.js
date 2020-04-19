import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import AlertPro from "react-native-alert-pro";

const users = [];
const defaultBackground =
  "http://getwallpapers.com/wallpaper/full/1/9/3/861434-top-anime-background-1920x1080-xiaomi.jpg";
const defaultAvatar =
  "https://p7.hiclipart.com/preview/585/861/144/emoticon-avatar-kavaii-sina-weibo-chibi-cute-decorative-design-long-grass-yan.jpg";
export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      repeat_password: "",
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      const rootRef = firebase.database().ref();
      const usersRef = rootRef.child("users");

      usersRef.on("value", (snapshot) => {
        snapshot.forEach((doc) => {
          users.push({
            email: doc.toJSON().email,
            password: doc.toJSON().password,
            username: doc.toJSON().username,
          });
        });
        //console.log(users);
        usersRef.off();
      });

      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackPress
      );
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.backHandler.remove();
  }

  handleBackPress = async () => {
    this.props.navigation.navigate("Login");
    return true;
  };

  handleSignUp = async () => {
    const rootRef = firebase.database().ref();
    const usersRef = rootRef.child("users");

    usersRef.on("value", (snapshot) => {
      snapshot.forEach((doc) => {
        users.push({
          email: doc.toJSON().email,
          password: doc.toJSON().password,
          username: doc.toJSON().username,
        });
      });
      //console.log(users);
      usersRef.off();
    });

    var aa = 0;
    for (var i = 0; i < users.length; i++) {
      if (this.state.email === users[i].email) {
        aa++;
      }
    }
    console.log(aa);

    // Kiểm tra điều kiện user vừa tạo và đẩy lên Realtime database
    if (
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.username === "" ||
      this.state.repeat_password === ""
    ) {
      alert("Don't let blank");
    } else if (this.state.repeat_password !== this.state.password) {
      alert("Password and Confirm password doesn't match");
      this.setState({ repeat_password: "" });
    } else if (aa === 0) {
      firebase
        .database()
        .ref("users/")
        .push({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          avatar: defaultAvatar,
        })
        .then((data) => {
          console.log("data ", data);
        })
        .catch((error) => {
          console.log("error ", error);
        });

      //Đẩy avatar của user vừa tạo lên Storage
      const response = await fetch(defaultAvatar);
      const blob = await response.blob();
      ref = firebase
        .storage()
        .ref()
        .child("UserAvatars/" + this.state.username)
        .put(blob)
        .then(function (snapshot) {
          console.log("Uploaded avatar");
        });
      // Đẩy background user vừa tạo lên Storage
      const response1 = await fetch(defaultBackground);
      const blob1 = await response1.blob();
      ref = firebase
        .storage()
        .ref()
        .child("UserBackgrounds/" + this.state.username)
        .put(blob1)
        .then(function (snapshot) {
          console.log("Uploaded background!");
        });
      // alert('Success');
      this.AlertProSuccess.open();
    } else {
      alert("This user have already been registed");
    }
  };
  onbackLoginform = async () => {
    this.props.navigation.navigate("Login");
  };
  //////////////////////////////////////////////// kiểm tra các input
  testEmail = async () => {
    var aa = 0;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    for (var i = 0; i < users.length; i++) {
      if (this.state.email === users[i].email) {
        aa++;
      }
    }
    console.log(aa);
    if (this.state.email === "") {
      return true;
    } else if (mailformat.test(this.state.email) == false) {
      alert("You have entered an invalid email address");
      this.setState({ email: "" });
      return false;
    } else if (aa !== 0) {
      alert("Email already in use");
      this.setState({ email: "" });
    }
  };
  testUsername = async () => {
    var aa = 0;
    for (var i = 0; i < users.length; i++) {
      if (this.state.username === users[i].username) {
        aa++;
      }
    }
    console.log(aa);
    if (aa !== 0) {
      alert("Username already in use");
      this.setState({ username: "" });
    }
  };
  testPassword = async () => {
    if (this.state.password === "") {
      return true;
    } else if (this.state.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      this.setState({ password: "" });
    }
  };
  testRepeatpassword = async () => {
    if (this.state.repeat_password === "") {
      return true;
    } else if (this.state.password !== this.state.repeat_password) {
      alert("Password doesn't match");
      this.setState({ repeat_password: "" });
    }
  };
  ////////////////////////////////////////
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
              style={styles.container}
              source={require("../assets/images/SignupScreen.png")}
            >
              <Text style={styles.headerText}>SIGN UP</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.textInput}
                  underlineColorAndroid='white'
                  autoCapitalize='none'
                  placeholder='username'
                  placeholderTextColor='white'
                  onChangeText={(username) => this.setState({ username })}
                  value={this.state.username}
                  onEndEditing={() => this.testUsername()}
                  maxLength={100}
                />
                <TextInput
                  style={styles.textInput}
                  underlineColorAndroid='white'
                  autoCapitalize='none'
                  placeholder='email'
                  placeholderTextColor='white'
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  onEndEditing={() => this.testEmail()}
                  maxLength={100}
                />
                <TextInput
                  style={styles.textInput}
                  secureTextEntry
                  underlineColorAndroid='white'
                  autoCapitalize='none'
                  placeholder='password'
                  placeholderTextColor='white'
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  onEndEditing={() => this.testPassword()}
                  maxLength={100}
                />
                <TextInput
                  style={styles.textInput}
                  secureTextEntry
                  underlineColorAndroid='white'
                  autoCapitalize='none'
                  placeholder='repeat password'
                  placeholderTextColor='white'
                  onChangeText={(repeat_password) =>
                    this.setState({ repeat_password })
                  }
                  value={this.state.repeat_password}
                  onEndEditing={() => this.testRepeatpassword()}
                  maxLength={100}
                />
                <TouchableOpacity onPress={() => this.handleSignUp()}>
                  <LinearGradient
                    colors={["rgb(120,213,250)", "rgb(71,113,246)"]}
                    style={styles.signupButton}
                  >
                    <Text style={styles.signupText}>Sign Up</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.alreadyUser}>
                  <Text style={styles.alreadyText}>Already user?</Text>
                  <TouchableOpacity onPress={() => this.onbackLoginform()}>
                    <Text style={styles.alreadyText}>Click here</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <AlertPro
                ref={(ref) => {
                  this.AlertProSuccess = ref;
                }}
                onConfirm={() => this.AlertProSuccess.close()}
                title='Success'
                message='You can log in !'
                showCancel={false}
                showConfirm={true}
                // textCancel="Cancel"
                textConfirm='Confirm'
                customStyles={{
                  mask: {
                    backgroundColor: "transparent",
                  },
                  container: {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.0,

                    elevation: 24,
                  },
                  buttonConfirm: {
                    backgroundColor: "#27b81f",
                  },
                }}
              />
            </ImageBackground>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  headerText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginTop: "10%",
  },
  inputGroup: {
    // flex:1,
    alignItems: "center",
  },
  textInput: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
    width: 300,
    backgroundColor: "rgba(0,0,0,0)",
    color: "white",
    fontWeight: "100",
    marginTop: 8,
    padding: 8,
    borderRadius: 30,
  },
  signupButton: {
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginTop: "7%",
  },
  signupText: {
    color: "white",
    fontWeight: "200",
  },
  alreadyUser: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  alreadyText: {
    marginLeft: "5%",
    color: "white",
  },
});
