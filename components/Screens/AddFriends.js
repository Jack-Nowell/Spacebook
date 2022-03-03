import React, {Component} from 'react';
import { StyleSheet, TextInput, Button, View, ScrollView, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            search: "",
            listData: []
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

    //handle GET request to /search
    searchUsers = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        if(token == null) {
            console.log("authentication issue");
            this.props.navigation.navigate("Login");
        } else {
            let request = "http://localhost:3333/api/1.0.0/search?q=";
            request += this.state.search;
            request += "&search_in=all";
            return fetch (request, {
                method: "GET",
                headers: {
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("search successful");
                    return response.json();
                } else {
                    throw response.status + ": Something happened";
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    listData: responseJson
                });
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    //handle POST request to /user/{user_id}/friends
    SendRequest = async (user_id) => {
        const token = await AsyncStorage.getItem("@session_token");
        if(token == null) {
            console.log("authentication issue");
            this.props.navigation.navigate("Login");
        } else {
            let request = "http://localhost:3333/api/1.0.0/user/";
            request += user_id;
            request += "/friends";
            return fetch (request, {
                method: "POST",
                headers: {
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if(response.status === 201) {
                    console.log("request sent");
                } else if(response.status === 403) {
                    console.log("user has already been sent a friend request");
                } else {
                    throw response.status + ": Something happened";
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    render() {
        return(
            <View>
                <TextInput 
                    placeholder = "Search"
                    onChangeText = {(search) => this.setState({search})}
                    value = {this.state.search}
                />
                <Button title = "Search"
                    onPress = {() => this.searchUsers()}
                />
                <ScrollView>
                    <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                        <View>
                            <Text>{item.user_givenname} {item.user_familyname}</Text>
                            <Button
                                title="Add"
                                onPress={() => this.SendRequest(item.user_id)}
                            />
                        </View>
                        )}
                        keyExtractor={(item,index) => item.user_id.toString()}
                    />
                </ScrollView>
            </View>
        );
    }
}