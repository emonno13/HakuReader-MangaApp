import React, { Component } from 'react';
import { View, Text ,StyleSheet, Image} from 'react-native';

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{ uri: this.props.item.avatar }} style={{width: 40,height:40, borderRadius:20,marginLeft:'5%'}}/>
        
        <View style={styles.groupComment}>
          <Text style={{color:'white'}}>{this.props.item.username}</Text>
          <Text style={{fontSize:15,width:250,color:'white'}}>{this.props.item.comment}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        marginTop: 5,
        marginBottom:5,
        backgroundColor:'black'
    },
    groupComment:{
      marginLeft:'5%'
    }
})