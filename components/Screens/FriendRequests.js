import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            listData: []
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
            this.GetRequests();
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

    //handle GET request to /friendrequests
    GetRequests = async () => {
        const token = await AsyncStorage.getItem("@session_token");
        if(token == null) {
            console.log("authentication issue");
            this.props.navigation.navigate("Login");
        } else {
            let request = "http://localhost:3333/api/1.0.0/friendrequests";
            return fetch (request, {
                method: "GET",
                headers: {
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("get friend requests successful");
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

    //handle POST request to /friendrequests/{user_id}
    AcceptRequest = async (user_id) => {
        const token = await AsyncStorage.getItem("@session_token");
        if(token == null) {
            console.log("authentication issue");
            this.props.navigation.navigate("Login");
        } else {
            let request = "http://localhost:3333/api/1.0.0/friendrequests/";
            request += user_id;
            return fetch (request, {
                method: "POST",
                headers: {
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("accept successful");
                } else {
                    throw response.status + ": Something happened";
                }
            })
            .then(() => {
                this.GetRequests();
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    //handle DELETE request to /friendrequests/{user_id}
    RejectRequest = async (user_id) => {
        const token = await AsyncStorage.getItem("@session_token");
        if(token == null) {
            console.log("authentication issue");
            this.props.navigation.navigate("Login");
        } else {
            let request = "http://localhost:3333/api/1.0.0/friendrequests/";
            request += user_id;
            return fetch (request, {
                method: "DELETE",
                headers: {
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("reject successful");
                } else {
                    throw response.status + ": Something happened";
                }
            })
            .then(() => {
                this.GetRequests();
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    render() {
        return(
            <View>
                <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                    <View>
                        <Text>{item.first_name} {item.last_name}</Text>
                        <Button
                            title="Accept"
                            color="#36bf41"
                            onPress={() => this.AcceptRequest(item.user_id)}
                        />
                        <Button
                            title="Reject"
                            color="#cf2d2d"
                            onPress={() => this.RejectRequest(item.user_id)}
                        />
                    </View>
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                />
            </View>
        );
    }
}