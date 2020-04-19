import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet,AsyncStorage} from 'react-native'
export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.loading();
}
loading = async () => {
  setTimeout(async () => {
    const token = await AsyncStorage.getItem('@token');
    console.log(token);
    
    if (token !== null) {
        this.props.navigation.navigate('Main');
        // this.props.navigation.navigate('Home',token);
        //console.log(token);
    }
    else {
        this.props.navigation.navigate('Login');
    }
}, 500);
}
  render() {
    return (
      <View style={styles.container}>
        <Text>読み込み中 ...</Text>
        <ActivityIndicator size="large" color='#ad69d1'/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})