import React, { Component } from 'react';
import { View, Text,Image,StyleSheet,TouchableOpacity } from 'react-native';
import {MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons';
import {SingleImage} from 'react-native-zoom-lightbox';
export default class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    if(this.props.item.postContentImage === ''){
      return(
        <View style={styles.container}>
          <View style={styles.headerPost}>
            <Image source={{ uri: this.props.item.postAvatar }} style={styles.headerAvatar} />
            <View style={styles.groupUserName}>
              <Text style={styles.headerName}>{this.props.item.postUserName}</Text>
              <Text style={styles.headerTime}>{this.props.item.postTime.replace(" GMT+0700 (+07)", "")}</Text>
            </View>
            <View style={styles.groupLikeComment}>
              <TouchableOpacity style={styles.buttonLike}>
                <FontAwesome name="heart-o" size={32} color="#ffb3e2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonComment} onPress={()=>this.props.gotoCommentList()}>
                <FontAwesome name="comment-o" size={32} color="#ffb3e2" />
              </TouchableOpacity>
            </View>
          </View> 

        <View style={styles.groupContent}> 
           <Text style={styles.textContent}>{this.props.item.postContent}</Text>
        </View>

        
      </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.headerPost}>
            <Image source={{ uri: this.props.item.postAvatar }} style={styles.headerAvatar} />
            <View style={styles.groupUserName}>
              <Text style={styles.headerName}>{this.props.item.postUserName}</Text>
              <Text style={styles.headerTime}>{this.props.item.postTime.replace(" GMT+0700 (+07)", "")}</Text>
            </View>
            <View style={styles.groupLikeComment}>
              <TouchableOpacity style={styles.buttonLike}>
                <FontAwesome name="heart-o" size={32} color="#ffb3e2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonComment} onPress={() => this.props.gotoCommentList()}>
                <FontAwesome name="comment-o" size={32} color="#ffb3e2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.groupContent}>
            <Text style={styles.textContent} >{this.props.item.postContent}</Text>
            <SingleImage
              uri={this.props.item.postContentImage}
              style={styles.contentImage}
            />
          </View>
        </View>
      );
    }

    
  }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        // width:'100%',
        marginTop: 5,
        marginBottom:5,
        //borderColor:'white',
        borderRadius:1,
        // borderWidth:1,
        backgroundColor:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius:20
    },
    headerPost:{
        flexDirection:'row',
    },
    groupLikeComment:{
      alignItems: 'center', 
      flexDirection: 'row', 
      marginLeft: '20%'
    },
    buttonLike:{
      marginLeft: '2%'
    },
    buttonComment:{
      marginLeft: '12%'
    },
    groupUserName:{
      marginLeft:'2%'
    },
    headerAvatar:{
        width:40,
        height:40,
        borderRadius:10,
        marginTop:5,
        marginLeft:'5%'
    },
    headerName:{
        marginLeft:10,
        marginTop:2,
        fontSize:20,
        fontWeight:'bold'
    },
    headerTime:{
      fontSize:10,
      marginLeft:10,
      marginTop:0,
      color: 'grey'
    },
    groupContent:{
      marginLeft:'20%'
    },
    textContent:{
      fontSize:15,
      width:250,
      marginBottom:'2%'
    },
    contentImage:{
      width:'95%',
      height:250,
      borderRadius:20,
      
      marginVertical:'5%'
    }
})