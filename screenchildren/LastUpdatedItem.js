import React, { Component } from 'react';
import { View, Text,StyleSheet,Image,Button,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';




export default class LastUpdatedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image 
            source={{uri:this.props.item.imgSrc}} 
            style={{width:200,height:'100%'}}
        />
        <View style={styles.groupContent}>
            <Text style={styles.title}>{this.props.item.title}</Text>
            <Text style={styles.status}>Status:{this.props.item.status}</Text>
            
       
          
          <TouchableOpacity onPress={() => this.props.gotoManga(this.props.item)} >
            <LinearGradient 
                  start={{x: 0.0, y: 0.25}} 
                  end={{x: 0.5, y: 1.0}}
                  colors={['#33ccff', '#ff99cc']} 
                  style={styles.buttonReadBackGround}>
              <Text style={styles.textRead}>READ</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        //backgroundColor:'red',
        marginVertical:10,
        marginHorizontal:10
    },
    groupContent:{
        justifyContent:'center',
        alignItems:'flex-end',
        width:'50%'
    },
    title:{
        color:'white',
        fontSize:20,
        fontWeight:'500',
        textAlign:'right'
    },
    status:{
        color:'white',
        fontSize:10,
        fontWeight:'100',
        marginVertical:10
    },
    buttonReadBackGround:{
      width:100,height:50,justifyContent:'center',alignItems:'center',borderRadius:15
    },
    textRead:{
      fontSize:15,fontWeight:'bold',color:'white'
    }
})