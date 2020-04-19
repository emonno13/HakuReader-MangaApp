import React, { Component } from 'react';
import { View, Text , FlatList,Image,ScrollView,
        TouchableOpacity,Dimensions, ImageBackground,StyleSheet } from 'react-native';
import {SingleImage} from 'react-native-zoom-lightbox';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons,AntDesign,Entypo,Feather} from '@expo/vector-icons';
import CarouselChapter from '../components/CarouselChapter';
import { SearchBar } from 'react-native-elements';
import * as firebase from 'firebase';
import{firebaseConfig} from '../components/firebaseConfig';
//const data = this.props.navigation.getParam('data')


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export default class MangaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      data_by_search:[],
      search:'',
      favoriteGroups:[],
      imgSrc:''
    };
  }

  static navigationOptions = ({ navigation })=>{
    return {
        //Heading/title of the header
        title: 'Enjoy this manga',
        //Heading style
        headerStyle: {
          backgroundColor: 'white',
        },
        //Heading text color
        headerTintColor: 'black',
        headerRight: (
          <TouchableOpacity style={{marginRight:20}} onPress={navigation.getParam('saveToFavorite')}>
              <Feather name='bookmark' color='black' size={32} />
          </TouchableOpacity>
        ),

      };

  };

  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {

     

      !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
      this.props.navigation.setParams({ saveToFavorite: this.saveToFavorite });
      this.setState({imgSrc:this.props.navigation.getParam('data').imgSrc })
      //console.log(this.props.navigation.getParam('username'));
      
      //console.log(this.state.save_value)
      // vì object Chapter có các elements có key đằng trước nên ko dùng array.length được
      var chapterLength = Object.keys(this.props.navigation.getParam('data').chapters).length;
      //console.log(this.props.navigation.getParam('data'));
      //console.log(this.props.navigation.getParam('data').chapters[0].length); 
      //console.log(this.props.navigation.getParam('data').chapters[0].chapterImages[0]);
      //console.log(this.props.navigation.getParam('data').chapters[0].name);
      const chaptersInfo = [];
      for (var i = 0; i < chapterLength; i++) {
        chaptersInfo.push({
          title: this.props.navigation.getParam('data').title,
          imagecover: this.props.navigation.getParam('data').chapters[i].chapterImages[0],
          name: this.props.navigation.getParam('data').chapters[i].name,
          list: this.props.navigation.getParam('data').chapters[i].chapterImages
        })
      }

      this.setState({ data: chaptersInfo, data_by_search: chaptersInfo })


      const favoriteArrays = []
      const rootRef = firebase.database().ref();
      const usersRef = rootRef.child('users');
      usersRef.orderByChild('username').equalTo(this.props.navigation.getParam('username')).on('child_added', (childSnapshot) => {
       
       
      
        firebase.database().ref('users/' + childSnapshot.key + '/favorite').on('value', function (snapshot) {
          // let favoriteArrays = []
          snapshot.forEach((doc) => {
            favoriteArrays.push({
              comic_name: doc.toJSON().comic_name,
            });
          });
          // this.setState({favoriteGroups: favoriteArrays})
          // console.log(favoriteArrays);
          // console.log(Object.keys(favoriteArrays).length)
           usersRef.off()
        });



        this.setState({favoriteGroups: favoriteArrays})
        //console.log(Object.keys(this.state.favoriteGroups).length)
        
      })


    })}



  saveToFavorite = async() =>{

    const rootRef = firebase.database().ref();
    const usersRef = rootRef.child('users');
    const comic_title = this.props.navigation.getParam('data').title
    const comic_img = this.state.imgSrc.toString(); // chuyển dạng hình sang chuỗi mới đẩy lên realtime database dc 
    var count = 0;
    for(var i=0;i<Object.keys(this.state.favoriteGroups).length;i++){
      if(this.state.favoriteGroups[i].comic_name === this.props.navigation.getParam('data').title){
        count ++;
          
      }
    }
    // console.log(count);
    // console.log(comic_img)
    if(count === 0){
      usersRef.orderByChild('username').equalTo(this.props.navigation.getParam('username')).on('child_added', function(snapshot){
        firebase.database().ref('users/'+snapshot.key +'/favorite/').push({
              imgSrc:comic_img,
              comic_name: comic_title
          });
  
        })
      alert('Added to your favorite books')
    }else{
      alert('Added before')
    }

  }

  readChapter = async (item) =>{
    this.props.navigation.navigate('MangaList',{
      data: item,
      'username':this.props.navigation.getParam('username')
    });
  }
  search = text => {
    console.log(text);
  };

  clear = () => {
    this.search.clear();
  };

  SearchFilterFunction(text) {


    const book = this.state.data

    const newData = book.filter(function (item) {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
     data_by_search: newData,
     search: text,
    });
  }
  render() {
    return (
      <ScrollView style={styles.container} >
   
          {/* <SingleImage uri={this.props.navigation.getParam('data').imgSrc} style={{ width: 200,height:screenWidth/2}} /> */}

        <ImageBackground
          source={{ uri: this.props.navigation.getParam('data').imgSrc }}
          style={styles.backgroundInfo}>
          <View style={styles.viewInfo}>

            <Text style={styles.textTitle}>{this.props.navigation.getParam('data').title}</Text>
            <Text style={styles.textAuthor}>{this.props.navigation.getParam('data').author}</Text>
            <Text style={styles.textKind}>{this.props.navigation.getParam('data').kind}</Text>
            <Text style={styles.textStatus}>Status : {this.props.navigation.getParam('data').status}</Text>

            <View style={styles.groupScores}>
              <View style={styles.groupScroresChild}>
                <Ionicons name='ios-people' color='white' size={20} />
                <Text style={styles.textScoresChild}> {this.props.navigation.getParam('data').numOfFollowers} Followers</Text>
              </View>

              <View style={styles.groupScroresChild}>
                <AntDesign name='heart' color='white' size={20} />
                <Text style={styles.textScoresChild}> {this.props.navigation.getParam('data').numOfRatings} Ratings</Text>
              </View>

              <View style={styles.groupScroresChild}>
                <Entypo name='eye' color='white' size={20} />
                <Text style={styles.textScoresChild}> {this.props.navigation.getParam('data').numOfViews} Views</Text>
              </View>
            </View>

          </View>
        </ImageBackground>
    

        <View style={{backgroundColor:'black'}}>
          <Text style={{  fontSize:15,fontWeight:'400', color:'white', 
          textAlign: 'left', marginVertical:10,marginHorizontal:10,fontStyle:'italic'}}>
            {this.props.navigation.getParam('data').content}</Text>
        </View>
        
       

        
        
        
       
       {/* <FlatList 
            data={this.state.data}
            renderItem={({ item }) =>
            <TouchableOpacity onPress={() =>this.readChapter(item.list)}>
                <Image source={{uri: item.imagecover}} style={{width:100,height:100}}/>
                <Text style={{fontSize:25}}>{item.name}</Text>
            </TouchableOpacity>
                 
            }
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
          
          /> */}
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder="Search"
          value={this.state.search}
          lightTheme={null}
        />


          <CarouselChapter
            data={this.state.data_by_search} 
            style={styles.carousel} 
            readChapter={this.readChapter} 
            />
   
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1
  },
  backgroundInfo:{
    width: screenWidth, 
    height: screenHeight / 2
  },
 viewInfo:{
  backgroundColor: 'rgba(0,0,0,.6)', 
  width: screenWidth, 
  height: screenHeight / 2 ,
  justifyContent:'flex-end'
 },
 textTitle:{
  fontWeight:'bold',
  fontSize:40,
  color:'white',
  textAlign: 'left',
  marginLeft:10
 },
textAuthor:{
  fontWeight:'bold',
  fontSize:20,
  color:'white',
  textAlign: 'left',
  marginLeft:10
},
textKind:{
  fontWeight:'bold',
  fontSize:10,
  color:'white',
  textAlign: 'left',
  marginLeft:10
},
textStatus:{
  fontWeight:'bold',
  fontSize:10,
  color:'white',
  textAlign: 'left',
  marginLeft:10
},
groupScores:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginHorizontal:10,
  marginVertical:10
},
groupScroresChild:{
  flexDirection: 'row', 
  alignItems: 'center' 
},
textScoresChild:{
  fontWeight: 'bold', fontSize: 10, color: 'white', textAlign: 'left' 
},
carousel:{
  backgroundColor:'green'
},

})
