import React, {Component} from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            friend_data: null
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
            this.GetUser();
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
    GetUser = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        const id = await AsyncStorage.getItem("@friend_id");
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
                console.log("get user info successful");
                return response.json();
            } else {
                throw response.status + ": Something happened";
            }
        })
        .then((responseJson) => {
            this.state.friend_data = responseJson;
            console.log(responseJson);
        })
        .then(() => {
            this.forceUpdate();
        })
        .catch((error) => {
            console.log(error);
        })
    };

    render() {
        if(this.state.friend_data == null) {
            return (
                <View>
                    <Text></Text>
                </View>
            );
        } else {
            return (
                <View>
                    <ScrollView>
                        <Text>Welcome to {this.state.friend_data.first_name}'s Wall!</Text>
                        <Button
                            title = "Back"
                            onPress={() => this.props.navigation.navigate("Home")}
                        />
                    </ScrollView>
                </View>
            );
        }
    }
}