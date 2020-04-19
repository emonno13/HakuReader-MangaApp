import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar,
     Platform,Dimensions,BackHandler,TouchableOpacity,ScrollView ,
     ImageBackground,Image,TextInput,Button,AsyncStorage
    } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import{firebaseConfig} from '../components/firebaseConfig';
import {YellowBox} from 'react-native';


YellowBox.ignoreWarnings(['source.uri']);
// console.disableYellowBox = true;

contentImageDefault = 'http://sg4africa.org/wp-content/uploads/blank-00cc00_040004001.png'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export default class WriteMyPostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        content:'',
        contentImage: contentImageDefault
    };
  }

  static navigationOptions = ({ navigation })=>{
    return {
        //Heading/title of the header
        title: 'Create your post',
        //Heading style
        headerStyle: {
          backgroundColor: 'white',
        },
        //Heading text color
        headerTintColor: 'black',
        headerRight: (
          <TouchableOpacity style={{marginRight:20}} onPress={() => alert('Yo Yo')}>
              <Entypo name="share" size={32} color="black"/>
          </TouchableOpacity>
        ),

      };

  };


  componentDidMount (){
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    this.getPermissionAsync();
    
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result.uri);

    if (!result.cancelled) {
      //this.setState({ contentImage: result.uri });
      this.uploadImage(result.uri,this.props.navigation.getParam('username'));
    }

    
  };
  
  uploadImage = async (uri, imageName) => {
    
    const response = await fetch(uri);
    const blob = await response.blob();

     //Đẩy ảnh lên Firebase Storage
    ref = firebase.storage().ref().child("PostImages/" + imageName).put(blob).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    })
    .then(()=>{
       //Gọi link ảnh từ FirebaseStorage 
      const getImageUrl =  firebase.storage().ref("PostImages/" + imageName);
      getImageUrl.getDownloadURL().then(data => {
        this.setState({ contentImage: data})
      })
    })
   
  }

  postYourContents = async () =>{

    //Kiểm tra image của bài post : nếu image đó là hình mặc định, ko post hình mặc định đó lên
    if(this.state.contentImage === contentImageDefault ){
      firebase.database().ref().child('posts').push({
        postAvatar: this.props.navigation.getParam('avatar'),
        postUserName: this.props.navigation.getParam('username'),
        postTime: Date().toLocaleString("en-US"),
        postContent: this.state.content,
        postContentImage: '',
        postCommentList:{na:'a'}
      }).then((data) => {
        console.log('data ', data)
      }).catch((error) => {
        console.log('error ', error)
      })
    }else{
      firebase.database().ref().child('posts').push({
        postAvatar: this.props.navigation.getParam('avatar'),
        postUserName: this.props.navigation.getParam('username'),
        postTime: Date().toLocaleString("en-US"),
        postContent: this.state.content,
        postContentImage: this.state.contentImage,
        postCommentList:{na:'a'}
        
      }).then((data) => {
        console.log('data ', data)
      }).catch((error) => {
        console.log('error ', error)
      })
    }

  }

  render() {
    return (
   
        
      <ImageBackground
        source={{ uri: 'https://www.itl.cat/pics/b/29/293859_anime-background-wallpaper.jpg' }}
        style={styles.container}
      >

        <View style={styles.headInfo}>
          <Image source={{ uri: this.props.navigation.getParam('avatar') }} style={styles.avatar} />
          <Text style={styles.textName}>{this.props.navigation.getParam('username')}</Text>

        </View>

        <View style={styles.writeContent} >
          <TextInput
            multiline={true}
            style={{ width: '100%', height: '100%', marginVertical: '5%', marginHorizontal: '20%', fontWeight: '500', fontSize: 20 }}
            //secureTextEntry
            //underlineColorAndroid='rgba(0,0,0,0.0)'
            autoCapitalize="none"
            placeholder="Write something here ..."
            placeholderTextColor="grey"
            onChangeText={content => this.setState({ content })}
            value={this.state.content}
          />
        </View >

        <View style={styles.takeContentImage}>
          <TouchableOpacity style={{ marginLeft: 50 }} onPress={() => this._pickImage()}>
            <Entypo name="camera" size={50} color="black" />
          </TouchableOpacity>
          <Image
            style={styles.contentImage}
            source={{ uri: this.state.contentImage }}
          />
        </View>
        <Button title='Post' onPress={() => this.postYourContents()} />

      </ImageBackground>
           

        

    
    );
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:screenWidth,
      height:screenHeight,
      //justifyContent:'center',
      alignItems:'center',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headInfo: {
      flexDirection: 'row',
      width: '90%',
      backgroundColor: 'white',
      height: 80,
      alignItems: 'center',
      borderRadius:20
    },
    avatar: {
      marginLeft: '5%',
      height: 60,
      width: '15%',
      borderRadius: 30
    },
    textName:{
        marginLeft:10,
        fontSize:20,
        fontWeight:'600'
    },
    writeContent:{
        marginTop:'5%',
        width: '90%',
        backgroundColor: 'white',
        height: 200,
        alignItems: 'center',
        borderRadius:20
    },
    takeContentImage:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'5%',
        width: '90%',
        backgroundColor: 'transparent',
        height: 200,
        alignItems: 'center',
        borderRadius:20
    },
    contentImage:{
        height:200,
        width:200,
        borderColor:'white',
        borderWidth:2
    }

  })
  