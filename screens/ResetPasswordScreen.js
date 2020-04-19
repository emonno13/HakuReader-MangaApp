import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Button,
  ImageBackground,
  Platform,
  BackHandler,
} from "react-native";
import firebase from "firebase";
import { sendGridEmail } from "react-native-sendgrid";
import { firebaseConfig } from "../components/firebaseConfig";

//MailGun

let input_code_attemp = 0;
const emailsArray = [];

//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
const SENDGRIDAPIKEY =
  "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";
const FROMEMAIL = "HakuSupport@hakureader.com.vn";
//const TOMEMAIL = "emonno13@gmail.com";
const SUBJECT = "Change Password";
let save_random_code = "";
//let save_snapshot_key ='';

export default class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailcode: "",
      repeat_password: "",
    };
  }

  // Step 1 : kiểm tra email có tồn tại hay không, kiểm tra xem có
  // Step 2 : kiểm tra 2 password, kiểm tra ko dc rỗng, sai thì xóa code và bắt bấm gửi mail lại

  componentDidMount() {
    !firebase.apps.length
      ? firebase.initializeApp(firebaseConfig)
      : firebase.app();

    //Kiểm tra xem email có tồn tại trong database

    firebase
      .database()
      .ref()
      .child("users")
      .on("value", (snapshot) => {
        snapshot.forEach((doc) => {
          emailsArray.push({
            email: doc.toJSON().email,
          });
        });
        console.log(emailsArray);
      });

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = async () => {
    //this.props.navigation.navigate('Login');
    this.props.navigation.navigate("Login");
    return true;
  };

  onYourSendEmailFunction = async () => {
    var aa = 0;
    for (var i = 0; i < emailsArray.length; i++) {
      if (this.state.email === emailsArray[i].email) {
        aa++;
      }
    }
    if (this.state.email === "") {
      alert("Please input your email");
    } else if (aa == 0) {
      alert("Email is not registed!");
      this.setState({ email: "" });
    } else {
      const randomcode = Math.random().toString(36).substring(7);
      console.log(randomcode);
      const ContactDetails = "Your code for resetting password : " + randomcode;
      const sendRequest = sendGridEmail(
        SENDGRIDAPIKEY,
        this.state.email,
        FROMEMAIL,
        SUBJECT,
        ContactDetails
      );
      sendRequest
        .then((response) => {
          console.log("Success"), alert("Email is sent!");
        })
        .catch((error) => {
          console.log(error);
        });
      save_random_code = randomcode;
    }
  };

  testInputCode = async () => {
    if (input_code_attemp === 2) {
      alert("Your code is cleared. Press send mail again");
      save_random_code = "";
      input_code_attemp = 0;
    } else if (
      this.state.emailcode !== save_random_code ||
      this.state.emailcode === ""
    ) {
      alert("Please input right code");
      this.setState({ emailcode: "" });
      input_code_attemp++;
      console.log(input_code_attemp);
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

  onChangePassword = async () => {
    console.log(save_random_code);
    const rootRef = firebase.database().ref();
    const usersRef = rootRef.child("users");
    const save_pass = this.state.password;

    if (
      this.state.password === "" ||
      this.state.repeat_password === "" ||
      this.state.emailcode === ""
    ) {
      alert("Please input all");
    } else if (this.state.password !== this.state.repeat_password) {
      alert("Password doesn't match");
      this.setState({ repeat_password: "" });
    } else {
      usersRef
        .orderByChild("email")
        .equalTo(this.state.email)
        .on("child_added", function (snapshot) {
          firebase
            .database()
            .ref("users/" + snapshot.key)
            .update({
              password: save_pass,
            });
        });
      alert("Success");
    }
  };
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          {/* <StatusBar
          barStyle='light-content'
          hidden={false}
          backgroundColor='#C2185B'
          translucent={false}
        /> */}
          {/* <KeyboardAvoidingView behavior='padding' style={styles.container}> */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
              style={styles.container}
              source={{
                uri:
                  "https://raw.githubusercontent.com/flatlogic/react-native-starter/master/assets/images/background.png",
              }}
            >
              <View style={styles.container}>
                <Text style={styles.textForgot}>Forgot Password ?</Text>

                <View style={styles.groupInput}>
                  <Text style={styles.textStep}>
                    Step 1: Please enter your email and we'll send you the code
                    to reset your password
                  </Text>
                  <TextInput
                    style={styles.textofInput}
                    underlineColorAndroid='white'
                    autoCapitalize='none'
                    placeholder='Your email'
                    placeholderTextColor='white'
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                  />
                  <TouchableOpacity
                    style={styles.btnSendMail}
                    onPress={() => this.onYourSendEmailFunction()}
                  >
                    <Text style={styles.textSendMail}>Send Mail</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.groupInput}>
                  <Text style={styles.textStep}>
                    Step 2: Check your email and input your code
                  </Text>
                  <TextInput
                    style={styles.textofInput}
                    underlineColorAndroid='white'
                    autoCapitalize='none'
                    placeholder='Input your code'
                    placeholderTextColor='white'
                    onChangeText={(emailcode) => this.setState({ emailcode })}
                    value={this.state.emailcode}
                    onEndEditing={() => this.testInputCode()}
                  />
                  <TextInput
                    style={styles.textofInput}
                    secureTextEntry
                    underlineColorAndroid='white'
                    autoCapitalize='none'
                    placeholder='New password'
                    placeholderTextColor='white'
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                    onEndEditing={() => this.testPassword()}
                  />
                  <TextInput
                    style={styles.textofInput}
                    secureTextEntry
                    underlineColorAndroid='white'
                    autoCapitalize='none'
                    placeholder='Confirm password'
                    placeholderTextColor='white'
                    onChangeText={(repeat_password) =>
                      this.setState({ repeat_password })
                    }
                    value={this.state.repeat_password}
                    onEndEditing={() => this.testRepeatpassword()}
                  />
                  <TouchableOpacity
                    style={styles.btnSendMail}
                    onPress={() => this.onChangePassword()}
                  >
                    <Text style={styles.textSendMail}>Change Password</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>
          {/* </KeyboardAvoidingView> */}
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
  textofInput: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
    width: 300,
    backgroundColor: "rgba(0,0,0,0)",
    color: "white",
    fontWeight: "100",
    marginTop: 2,
    padding: 8,
    borderRadius: 30,
  },
  textForgot: {
    width: 300,
    fontSize: 30,
    textAlign: "left",
    color: "white",
  },
  groupInput: {
    marginTop: 40,
  },
  textStep: {
    width: 300,
    textAlign: "left",
    color: "white",
  },
  btnSendMail: {
    width: 300,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
  },
  textSendMail: {
    color: "white",
    fontWeight: "bold",
  },
  AndroidSafeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // backgroundColor:'rgba(0,0,0,0)'
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
