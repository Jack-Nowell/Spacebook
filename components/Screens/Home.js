import React, {Component} from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends Component {
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
            this.GetFriends();
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

    //handle GET request to /user/{user_id}/friends
    GetFriends = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        const id = await AsyncStorage.getItem("@user_id");
        let request = "http://localhost:3333/api/1.0.0/user/";
        request += id;
        request += "/friends";
        return fetch (request, {
            method: "GET",
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200) {
                console.log("get user friends successful");
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
    };

    NavigateToFriend = async (id) => {
        await AsyncStorage.setItem("@friend_id", id);
        this.props.navigation.navigate("Wall");
    };

    render() {
        return(
            <View>
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        renderItem={({item}) => (
                        <View>
                            <Text>{item.user_givenname} {item.user_familyname}</Text>
                            <Button
                                title="Go to Wall"
                                onPress={() => this.NavigateToFriend(item.user_id)}
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