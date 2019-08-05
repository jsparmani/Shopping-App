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
import { connect } from "react-redux";
import { userCheck } from "../src/actions";

var routes = ["Home", "Orders", "Settings"];
class SideBar extends React.Component {

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
                                this.props.userCheck(true, user.uid, user.email);

                            } else {
                                routes = ["Home", "Orders", "Settings"]
                                this.props.userCheck(false, user.uid, user.email);
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
                        source={require('../assets/icon.png')}
                        resizeMode="contain"
                        style={{
                            height: 120,
                            width: "100%",
                            alignSelf: "stretch",
                            position: "absolute"
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

export default connect(null, { userCheck })(SideBar)