import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage,
  TextInput,
  Button,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
//import AlertPro from "react-native-alert-pro";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

const users = [];
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      email: "",
      password: "",
      error: "",
      loading: false,
      array: [],
    };
  }

  componentDidMount() {
    //Gọi mảng users trên realtime database
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
  }
  componentWillUnmount() {}

  onLoginPress() {
    this.setState({ error: "", loading: true });

    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ error: "", loading: false });
        this.props.navigation.navigate("Main");
      })
      .catch(() => {
        this.setState({ error: "Authentication failed", loading: false });
      });
  }
  renderButtonOrLoading() {
    if (this.state.loading) {
      return <Text> Loading </Text>;
    }
    return (
      <View>
        <Button onPress={this.onLoginPress.bind(this)} title='Login' />
        <Button onPress={this.onSignUpPress.bind(this)} title='Sign up' />
      </View>
    );
  }
  successLogin = (info) => {
    alert("Hello");
    this.setState({
      userInfo: info,
    });
    this.props.SaveInfoToState(info);
    console.log("info login screen:", info);
  };

  onFacebookLoginPress = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync("1363360493844802", {
        permissions: ["public_profile"],
      });
      console.log(type);
      if (type === "success") {
        console.log(type);
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture,gender`
        );
        this.state.userInfo = await response.json();
        console.log("login fb here: ", this.state.userInfo);
        this.setState({
          userInfo: this.state.userInfo,
        });

        await AsyncStorage.setItem("@token", token);
        this.props.navigation.navigate("Main");
        Alert.alert("Logged in!", `Hi ${this.state.userInfo.name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  onGoogleLoginPress = async () => {
    //alert("hi");
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        androidClientId: `76641770158-66ur9cr372lnembbfmepf5hsldd92fgh.apps.googleusercontent.com`,
        scopes: ["profile", "email"],
      });
      //console.log(accessToken);
      if (type === "success") {
        //console.log("hehe");
        await AsyncStorage.setItem("@token", accessToken);
        this.props.navigation.navigate("Main");
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  onPressLoginButton = async () => {
    var flag = false;
    const response = await fetch(
      `https://raw.githubusercontent.com/emonno13/jsontest/master/userlogin.json`
    );

    const jsonData = await response.json();
    // = jsonData;
    console.log(jsonData);
    for (var i = 0; i < jsonData.length; i++) {
      if (
        this.state.email === jsonData[i].user_id &&
        this.state.password === jsonData[i].password
      ) {
        flag = true;
      }
    }
    if (flag === true) {
      console.log("Success");
      await AsyncStorage.setItem("@token", "69");
      this.props.navigation.navigate("Main");
    } else {
      console.log("Failed");
      // this.AlertPro.open();
    }

    console.log(this.state.email);
  };

  onLoginFirebase = async () => {
    //Tìm username tương ứng với email vừa nhập
    let save_username = "";
    let count = 0;
    for (var i = 0; i < users.length; i++) {
      if (
        this.state.email === users[i].email &&
        this.state.password === users[i].password
      ) {
        save_username = users[i].username;
        count = 1;
      }
    }
    if (count === 1) {
      console.log("Success");
      AsyncStorage.setItem("@token", save_username);
      this.props.navigation.navigate("Main");
      // this.props.navigation.navigate('Main',{name:this.state.email});
      //Alert.alert('Logged in!',`Hi`+save_username ,{cancelable: false} );
    } else {
      console.log("Failed");
      console.log(count);
      Alert.alert("Wrong Input", `Please input again`);
      // this.AlertPro.open();
    }
    // End
  };

  onSignUpButtion = async () => {
    this.props.navigation.navigate("Signup");
  };
  onResetPassword = async () => {
    this.props.navigation.navigate("ResetPassword");
  };
  // _storeData = async () => {
  //   try {
  //     await AsyncStorage.setItem('TASKS', 'I like to save it.');
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };
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
              source={{
                uri:
                  "http://images6.fanpop.com/image/photos/37600000/Rail-wars-rail-wars-37679210-715-995.jpg",
              }}
            >
              <Text style={styles.title}>🅗 🅐 🅚 🅤</Text>
              <View style={styles.textInput}>
                <Image
                  style={styles.iconInput}
                  source={{
                    uri:
                      "https://img.icons8.com/nolan/64/000000/user-male-circle.png",
                  }}
                />
                <TextInput
                  style={styles.textofInput}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  autoCapitalize='none'
                  placeholder='Email'
                  placeholderTextColor='white'
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                />
              </View>
              <View style={styles.textInput}>
                <Image
                  style={styles.iconInput}
                  source={{
                    uri: "https://img.icons8.com/nolan/96/000000/unlock-2.png",
                  }}
                />
                <TextInput
                  style={styles.textofInput}
                  secureTextEntry
                  underlineColorAndroid='rgba(0,0,0,0.0)'
                  autoCapitalize='none'
                  placeholder='Password'
                  placeholderTextColor='white'
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => this.onLoginFirebase()}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
              <Text style={styles.text}>OR</Text>
              <View style={styles.loginFacebookGoogleWrapper}>
                <TouchableOpacity
                  style={styles.facebookButton}
                  onPress={() => this.onFacebookLoginPress()}
                >
                  <Image
                    style={styles.facebookIcon}
                    source={{
                      uri:
                        "https://icon-library.net/images/facbook-icon-png/facbook-icon-png-4.jpg",
                    }}
                  />
                  <Text style={styles.facebookText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={() => this.onGoogleLoginPress()}
                >
                  <Image
                    style={styles.googleIcon}
                    source={{
                      uri:
                        "https://assets.materialup.com/uploads/82eae29e-33b7-4ff7-be10-df432402b2b6/preview",
                    }}
                  />
                  <Text style={styles.googleText}>Google</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => this.onResetPassword()}>
                <Text style={{ color: "#bae3e3", marginLeft: 20 }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "white",
                }}
              >
                <Text style={{ color: "white" }}>Not on Haku yet?</Text>
                <TouchableOpacity onPress={() => this.onSignUpButtion()}>
                  <Text style={{ color: "#bae3e3", marginLeft: 10 }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

//export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    color: "white",
    fontSize: 30,
  },
  textInput: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
    //borderWidth: 1,
    width: 320,
    backgroundColor: "rgba(255,255,255,0.3)",
    color: "white",
    marginTop: 8,
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  iconInput: {
    justifyContent: "center",
    width: 30,
    height: 30,
  },
  textofInput: {
    color: "white",
    marginLeft: 5,
    width: 250,
  },
  loginButton: {
    marginTop: 8,
    width: 320,
    //backgroundColor: '#00b5ec',
    backgroundColor: "rgba(87, 188, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 50,
  },
  loginText: {
    padding: 8,
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  facebookButton: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#3b5998",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,

    elevation: 23,
  },
  facebookIcon: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    margin: 5,
  },
  facebookText: {
    color: "white",
    padding: 7,
    fontWeight: "bold",
  },
  googleButton: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,

    elevation: 23,
  },
  googleIcon: {
    width: 20,
    height: 20,
    margin: 7,
  },
  googleText: {
    padding: 7,
    color: "rgba(0, 0, 0, 0.7)",
    //fontWeight:'bold'
  },
  loginFacebookGoogleWrapper: {
    flexDirection: "row",
    marginTop: 10,
  },
  text: {
    color: "white",
    marginTop: 10,
  },
});

{
  /* <AlertPro
ref={ref => {
  this.AlertPro = ref;
}}
onCancel={() => this.AlertPro.close()}
title="Failed Authentication"
message="Please input again !"
showCancel={true}
showConfirm={false}
textCancel="Cancel"
customStyles={{
  mask: {
    backgroundColor: "transparent"
  },
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  buttonConfirm: {
    backgroundColor: "#ffa31a"
  }
}}
/> */
}

// import React, { Component } from 'react'
// import { Platform, StyleSheet, Text, View, TextInput, Button, ActivityIndicator } from 'react-native';
// import { connect } from 'react-redux';
// import { loginAction } from '../Action/action';
// import axios from 'axios';
// import { Provider } from 'react-redux';
// import store from '../Store/store';

// class LoginScreen extends Component {
//     static navigationOptions = {
//         title: 'Bion',
//         headerStyle: {
//             backgroundColor: '#841584',
//         },
//         headerTintColor: '#fff',
//         headerTitleStyle: {
//             fontWeight: 'bold',
//         },
//     };
//     constructor(props) {
//         super(props);
//         this.state = {
//             username: '',
//             password: '',
//             tokenVN: '',
//             isLoading: false,
//         };
//     }
//     login(e) {

//         this.setState({ isLoading: true })
//         axios
//             .post('https://reqres.in/api/login',
//                 {
//                     'email': this.state.username,
//                     'password': this.state.password
//                 }
//             )
//             .then((response) => {
//                 this.props.loginA(this.state.username, this.state.password),
//                 this.setState({ tokenVN: response.data.token, isLoading: false })
//                 this.props.navigation.navigate('Main')
//             })
//             .catch((err) => console.log(err))
//     }

//     render(){
//         return(
//             <Provider store={store}>
//                 <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                     <TextInput
//                         style={styles.textInput}
//                         autoCapitalize="none"
//                         placeholder="User ID"
//                         onChangeText={email => this.setState({ email })}
//                         value={this.state.email}
//                     />
//                     <TextInput
//                         secureTextEntry
//                         style={styles.textInput}
//                         autoCapitalize="none"
//                         placeholder="Password"
//                         onChangeText={password => this.setState({ password })}
//                         value={this.state.password}
//                     />
//                     <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
//                         onPress={() => this.login()}>
//                         <Text style={styles.loginText}>Login</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Provider>

//         );
//     }

// }

// const styles = StyleSheet.create({
//     groupName: {
//         fontSize: 16,
//         paddingLeft: 10,
//         marginTop: 10,
//         borderRadius: 3,
//         height: 40, borderColor: '#841584', borderWidth: 1,
//     },
//     viewGroupName: {
//         marginTop: 15,
//         marginLeft: 15, marginRight: 15
//     },
//     viewContainer: {
//         width: '100%',
//         backgroundColor: '#ffffff'
//     },
//     viewButton: {
//         borderRadius: 5, marginTop: 30, height: 50,
//         marginLeft: 15, marginRight: 15, alignContent: 'center',
//     }
// });

// const mapStateToProps = (state) => ({

// });

// const mapDispatchToProps = (dispatch) => ({
//     loginA: (username, password) => dispatch(loginAction(username, password))

// });

// export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
