import React, {Component} from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            first_name: "Jack",
            last_name: "Nowell",
            email: "jack.nowell@sky.com",
            password: "pass123"
        };
    }

    //handle POST request to /user
    createPressed() {
        let to_send = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };

        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            if(response.status === 201) {
                console.log("Account Created");
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
                    await AsyncStorage.setItem("@user_id", responseJson.user_id);
                    this.props.navigation.navigate("Home");
                })
                .catch((error) => {
                    console.log(error);
                })
            } else {
                throw response.status + ": Something happened";
            } 
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return(
            <View>
                <TextInput
                    placeholder = "First name"
                    onChangeText = {(first_name) => this.setState({first_name})}
                    value = {this.state.first_name}
                />
                <TextInput
                    placeholder = "Last Name"
                    onChangeText = {(last_name) => this.setState({last_name})}
                    value = {this.state.last_name}
                />
                <TextInput
                    placeholder = "E-Mail"
                    onChangeText = {(email) => this.setState({email})}
                    value = {this.state.email}
                />
                <TextInput
                    placeholder = "Password"
                    onChangeText = {(password) => this.setState({password})}
                    value = {this.state.password}
                />
                <Button
                    title = "Create Account"
                    onPress = {() => this.createPressed()} 
                />
                <Button
                    title = "Back"
                    onPress = {() => this.props.navigation.goBack()}
                />
            </View>
        );
    }
}

//stylesheet