import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AddFriends from '../Screens/AddFriends.js';
import FriendRequests from '../Screens/FriendRequests.js';

const Tab = createBottomTabNavigator();

export default class FriendNav extends Component {
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        if (token == null) {
            this.props.navigation.navigate("Login");
        }
    };

    render() {
        return(
            <Tab.Navigator>
                <Tab.Screen name="Add" component={AddFriends} />
                <Tab.Screen name="Requests" component={FriendRequests} />
            </Tab.Navigator>
        );
    }
}