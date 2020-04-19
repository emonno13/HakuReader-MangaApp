import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoadingScreen from '../screens/LoadingScreen'
import MainTabNavigator from './MainTabNavigator';
import CategoryScreen from '../screens/CategoryScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignupScreen  from '../screens/SignupScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ForumScreen from '../screens/ForumScreen';
import WriteMyPostScreen from '../screens/WriteMyPostScreen';
import MangaScreen from '../screens/MangaScreen';
import MangaListImagesScreen from '../screens/MangaListImagesScreen';
import Drawer from '../screens/Drawer'
import BookmarkScreen from '../screens/BookmarkScreen';
import Carousel1 from '../components/Carousel1';
import SliderEntry from '../components/SliderEntry';

export default createAppContainer(
  createSwitchNavigator({
    Bookmark:BookmarkScreen,
    Drawer:Drawer,
    MangaList: MangaListImagesScreen,
    Manga:MangaScreen,
    WriteMyPost: WriteMyPostScreen,
    Forum: ForumScreen,
    ResetPassword: ResetPasswordScreen,
    Profile: ProfileScreen,
    Loading: LoadingScreen,
    Category: CategoryScreen,
    Splash: SplashScreen,
    Signup: SignupScreen,
    Login : LoginScreen,
    Main: MainTabNavigator,
  },
  {
    initialRouteName:'Splash',
    /* The header config from HomeScreen is now here */
  }
  )
);
