import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: "jack.nowell@sky.com",
            password: "pass123"
        };
    }

    //handle POST request to /login
    logInPressed() {
        let to_send = {
            email: this.state.email,
            password: this.state.password
        };

        return fetch("http://localhost:3333/api/1.0.0/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(to_send)
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("login successful");
                    return response.json();
                } else {
                    throw response.status + ": Something happened";
                }
            })
            .then(async(responseJson) => {
                console.log(JSON.stringify(responseJson));
                await AsyncStorage.setItem("@session_token", responseJson.token);
                await AsyncStorage.setItem("@user_id", responseJson.id);
                this.props.navigation.navigate("Home");
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return ( 
            <View>
                <TextInput 
                    placeholder = "E-Mail"
                    onChangeText = {(email) => this.setState({email})}
                    value = { this.state.email }
                />
                <TextInput 
                    placeholder = "Password"
                    onChangeText = {(password) => this.setState({password})}
                    value = { this.state.password }
                />
                <Button title = "Log In"
                    onPress = {() => this.logInPressed() }
                />
                <Button title = "Don't Have an Account?"
                    onPress = {() => this.props.navigation.navigate("Create Account") }
                />
            </View>
        );
    }
}

//stylesheet