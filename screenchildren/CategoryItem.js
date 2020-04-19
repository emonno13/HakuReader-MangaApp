import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity} from 'react-native';

export default class CategoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
            <TouchableOpacity onPress={() => this.props.gotoManga(this.props.item)}>
                <Image source={{ uri: this.props.item.imgSrc }} style={styles.imgComic} />
                <Text style={styles.title}>{this.props.item.title}</Text>
            </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginVertical:10,
    marginHorizontal:10,
    borderRadius:10,
    backgroundColor:'white',
    shadowColor: "#e5e5e5",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  imgComic:{
    width: '100%', 
    height: 100,
    borderRadius:10
  },
  title:{
    textAlign: 'center'
  }
})