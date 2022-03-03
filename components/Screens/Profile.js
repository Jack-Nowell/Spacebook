import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: null
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
            this.GetInfo();
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

    //handle GET request to /user/{user_id}
    GetInfo = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        const id = await AsyncStorage.getItem("@user_id");
        let request = "http://localhost:3333/api/1.0.0/user/";
        request += id;
        return fetch (request, {
            method: "GET",
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200) {
                console.log("get user id successful");
                return response.json();
            } else {
                throw response.status + ": Something happened";
            }
        })
        .then((responseJson) => {
            this.state.data = responseJson;
            console.log(responseJson);
        })
        .then(() => {
            this.forceUpdate();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        if(this.state.data == null) {
            return (
                <View>
                    <Text></Text>
                </View>
            );
        } else {
            return(
                <View>
                    <Text>Name: {this.state.data.first_name} {this.state.data.last_name}</Text>
                    <Text>E-mail: {this.state.data.email}</Text>
                </View>
            );
        }
    }
}