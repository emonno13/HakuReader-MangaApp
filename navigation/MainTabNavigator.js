import React from 'react';
import { Platform,ScrollView,Button,Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createAppContainer,
  DrawerItems } from 'react-navigation';
import {AntDesign,MaterialIcons,Ionicons,FontAwesome,MaterialCommunityIcons} from '@expo/vector-icons';
//import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForumScreen from '../screens/ForumScreen';
import WriteMyPostScreen from '../screens/WriteMyPostScreen';
import CommentScreen from '../screens/CommentScreen';
import MangaScreen from '../screens/MangaScreen';
import MangaListImagesScreen from '../screens/MangaListImagesScreen';
import Drawer from '../screens/Drawer';
import BookmarkScreen from '../screens/BookmarkScreen';
import LoginScreen from '../screens/LoginScreen';
const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
















//////////////////////////////////////////
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Manga: MangaScreen,
    MangaList: MangaListImagesScreen
  },
  config
);

HomeStack.navigationOptions = ({ navigation })=> {
  let tabBarVisible = true;
  if (navigation.state.index > 0 && navigation.state.routes[1].routeName === "Manga" || 
      navigation.state.index > 0 && navigation.state.routes[1].routeName === "MangaList" ) {
    tabBarVisible = false;
  }


  const HomeRoute = navigation.state.routes[0]; //
  return{
    tabBarVisible, // tắt tabBar cho 2 trang Manga và MangaList
    tabBarLabel: 'Home',
    tabBarOptions: { 
      activeTintColor: 'purple',
      inactiveTintColor: 'grey',
      },
    tabBarIcon: ({tintColor}) => <AntDesign name='home' color={tintColor} size={25}/>  ,
    //tabBarVisible: HomeRoute.params && HomeRoute.params.tabBarVisible, //
  }

  // tabBarIcon: ({ focused, tintColor }) => (
  //   <TabBarIcon
  //     focused={focused}
  //     tintColor={tintColor}
  //     color={tintColor}
  //     name={
  //       Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'
  //     }
  //   /> 
  // ),
  
};

HomeStack.path = '';


















//////////////////////////////////////////////////////
const CategoryStack = createStackNavigator(
  {
    Category : CategoryScreen,
    Manga: MangaScreen,
    MangaList: MangaListImagesScreen
  },
  config
);

CategoryStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0 && navigation.state.routes[1].routeName === "Manga" || 
      navigation.state.index > 0 && navigation.state.routes[1].routeName === "MangaList" ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Category',
    tabBarOptions: { 
      activeTintColor: 'purple',
      inactiveTintColor: 'grey',
 
    },  
    tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='buffer' color={tintColor} size={25}/>
    
  };
};
CategoryStack.path = '';













//////////////////////////////////////////////////////
const BookmarkStack = createStackNavigator(
  {
    Bookmark : BookmarkScreen,

  },
  config
);

BookmarkStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  return {
    tabBarVisible,
    tabBarLabel: 'Bookmark',
    tabBarOptions: { 
      activeTintColor: 'purple',
      inactiveTintColor: 'grey',
 
    },  
    tabBarIcon: ({tintColor}) => <MaterialIcons name='local-library' color={tintColor} size={25}/>
    
  };
};
BookmarkStack.path = '';



















/////////////////////////////
const ForumStack = createStackNavigator(
  {
    Forum : ForumScreen,
    WriteMyPost:WriteMyPostScreen,
    Comment:CommentScreen
  },
  config,
);

//////////////////////////////////////////////////////////////////////////////
ForumStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0 && navigation.state.routes[1].routeName === "WriteMyPost" || 
      navigation.state.index > 0 && navigation.state.routes[1].routeName === "Comment" ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Forum',
 
    //tabBarOptions chỉnh màu cho label khi nhấn
    tabBarOptions: { 
      activeTintColor: 'purple',
      inactiveTintColor: 'grey',
 
    },  
    tabBarIcon: ({tintColor}) => <Ionicons name='ios-people' color={tintColor} size={25}/>,
    
  };
};

ForumStack.path = '';













////////////////////////////
const ProfileStack = createStackNavigator(
  {
    Profile : ProfileScreen,
  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  //tabBarOptions chỉnh màu cho label khi nhấn
  tabBarOptions: { 
    activeTintColor: 'purple',
    inactiveTintColor: 'grey',

  },  
  tabBarIcon: ({tintColor}) => <FontAwesome name='user' color={tintColor} size={25}/>
};

ProfileStack.path = '';




























const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CategoryStack,
  BookmarkStack,
  ForumStack,
  ProfileStack,

});

tabNavigator.path = '';

//export default tabNavigator;

const RootStack = createDrawerNavigator(
  {
    Main: tabNavigator
  },
  {
    contentComponent: props => <ScrollView><Drawer {...props}/></ScrollView>
  }
);

export default RootStack;
