import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import React, {Component} from 'react';

import LogIn from '../Screens/LogIn.js';
import CreateAccount from '../Screens/CreateAccount.js';

const Stack = createStackNavigator();

export default class LogInNav extends Component {
  render() {
  return(
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="Create Account" component={CreateAccount} />
      </Stack.Navigator>
    );
  }
}