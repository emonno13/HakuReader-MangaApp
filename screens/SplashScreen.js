import React, { Component } from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import firebase from "firebase";
import "../components/fixtimerbug";
import { firebaseConfig } from "../components/firebaseConfig";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.loading();
  }
  componentDidMount() {
    !firebase.apps.length
      ? firebase.initializeApp(firebaseConfig)
      : firebase.app();
  }

  loading = async () => {
    setTimeout(async () => {
      this.props.navigation.navigate("Loading");
    }, 1000);
  };
  render() {
    return (
      <View>
        <Image
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          source={require("../assets/images/logo2.png")}
        />
      </View>
    );
  }
}
