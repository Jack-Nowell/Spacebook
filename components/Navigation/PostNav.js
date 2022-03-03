import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import React, {Component} from 'react';

import Home from '../Screens/Home.js';
import Wall from '../Screens/Wall.js';

const Stack = createStackNavigator();

export default class LogInNav extends Component {
  render() {
  return(
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Wall" component={Wall} />
      </Stack.Navigator>
    );
  }
}