import React from "react";
import { Image, Platform, StatusBar, View } from "react-native";
import {
    Button,
    Text,
    Container,
    List,
    ListItem,
    Content,
    Icon
} from "native-base";
import firebase from "firebase";

var routes = ["Home", "Orders", "Settings"];
export default class SideBar extends React.Component {

    componentDidMount() {

        firebase
            .auth()
            .onAuthStateChanged(user => {
                if (user) {
                    firebase
                        .database()
                        .ref(`admin-users/${user.uid}`)
                        .on('value', snapshot => {
                            if (snapshot.val()) {
                                routes = ["Home", "Add Item", "Settings"]

                            } else {
                                routes = ["Home", "Orders", "Settings"]
                            }
                        })


                }

            })
    }

    render() {

        return (
            <Container>
                <Content>
                    <Image
                        source={{
                            uri:
                                "https://raw.githubusercontent.com/GeekyAnts/NativeBase-KitchenSink/master/assets/drawer-cover.png"
                        }}
                        style={{
                            height: 120,
                            width: "100%",
                            alignSelf: "stretch",
                            position: "absolute"
                        }}
                    />
                    <Image
                        square
                        style={{
                            height: 80,
                            width: 70,
                            position: "absolute",
                            alignSelf: "center",
                            top: 20
                        }}
                        source={{
                            uri:
                                "https://raw.githubusercontent.com/GeekyAnts/NativeBase-KitchenSink/master/assets/logo.png"
                        }}
                    />
                    <List
                        dataArray={routes}
                        contentContainerStyle={{ marginTop: 120 }}
                        renderRow={data => {
                            return (
                                <ListItem

                                    button
                                    onPress={() => this.props.navigation.navigate(data === "Add Item" ? "Add_Item" : data)}
                                >
                                    <Text>{data}</Text>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }
}