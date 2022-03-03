import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {Component} from 'react';

//import screens
import PostNav from './components/Navigation/PostNav.js';
import Profile from './components/Screens/Profile.js';
import LogInNav from './components/Navigation/LogInNav.js';
import FriendNav from './components/Navigation/FriendNav.js';
import Logout from './components/Screens/Logout.js';

const Drawer = createDrawerNavigator();

export default class App extends Component {
  //remove any items from async storage
  clearStorage = async () => {
    AsyncStorage.clear();
  }

  componentDidMount() {
    this.clearStorage();
  }

  render() {
    return(
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={PostNav} />
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen name="Friends" component={FriendNav} />
          <Drawer.Screen name="Login" component={LogInNav} />
          <Drawer.Screen name="Log Out" component={Logout} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}