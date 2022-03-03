import React, {Component} from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }
    }

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

    LogOut = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        let request = "http://localhost:3333/api/1.0.0/logout";
        return fetch(request, {
            method: "POST",
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200) {
                console.log("logout successful");
            } else {
                throw response.status + ": Something happened";
            }
        })
        .then(() => {
            //clear async storage and send the user back to login screen
            AsyncStorage.clear();
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return(
            <View>
                <Text>Are you sure?</Text>
                <Button
                    title = "Log Out"
                    onPress = {() => this.LogOut()}
                />
            </View>
        );
    }
}