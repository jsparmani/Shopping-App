import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, TouchableOpacity, ActivityIndicator, FlatList, Image, ScrollView, Alert } from 'react-native';
import { Header, Title, Left, Icon, Right, Button, Body, Item, Input, Card } from "native-base";
import { connect } from "react-redux";
import * as firebase from "firebase";


class OrdersScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            isListEmpty: false,
        };
    }

    componentWillMount() {
        this.fetchOrders()
    }

    fetchOrders = () => {
        let self = this;

        let ordersRef = firebase
            .database()
            .ref(`/orders/${this.props.uid}`)
        ordersRef
            .on("value", dataSnapshot => {
                if (dataSnapshot.val()) {
                    let ordersResult = Object.values(dataSnapshot.val())

                    let ordersKey = Object.keys(dataSnapshot.val())

                    ordersKey.forEach((value, key) => {
                        ordersResult[key]["key"] = value;
                    })

                    self.setState({ isListEmpty: false, data: ordersResult.reverse() })
                } else {
                    self.setState({ isListEmpty: true })
                }
                self.setState({ isLoading: false })
            })
    };

    renderNotch = () => {
        if (Platform.OS === "android") {
            return (
                <View style={styles.notch} />
            )
        }
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View
                    style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
                >
                    <ActivityIndicator size="large" color="#B83227" />
                    <Text style={{ textAlign: "center" }}>
                        Orders loading please wait..
            </Text>
                </View>
            );
        } else if (this.state.isListEmpty) {

            return (

                <View style={{ flex: 1 }}>
                    {this.renderNotch()}
                    <Header
                        androidStatusBarColor="red"
                    >
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}>
                                <Icon name="menu" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Orders</Title>
                        </Body>

                    </Header>
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
                    >
                        <Text style={{ textAlign: "center" }}>No Orders!</Text>
                    </View>
                </View>

            );
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this.renderNotch()}
                    <Header
                        androidStatusBarColor="red"
                    >
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}>
                                <Icon name="menu" />
                            </Button>
                        </Left>
                        <Body>
                            <Title> Orders </Title>
                        </Body>


                    </Header>
                </View>
                <View style={{ flex: 9 }}>
                    <ScrollView>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) => {
                                let products = Object.values(item)
                                products.pop()
                                return (
                                    <Card>
                                        <Text style={{ fontSize: 20, alignSelf:"center", color: "#035eb5" }}> Order Id: {item.key} </Text>
                                        {products.map((itemChild) => {
                                            return (
                                                <View style={styles.listItem}>
                                                    <View>
                                                        <Image
                                                            style={styles.contactIcon}
                                                            source={
                                                                itemChild.imageUrl === "empty"
                                                                    ? require("../assets/person.png")
                                                                    : { uri: itemChild.imageUrl }
                                                            }
                                                        />
                                                    </View>
                                                    <View style={styles.infoContainer}>
                                                        <Text style={styles.infoText}>
                                                            {itemChild.name}
                                                        </Text>
                                                        <Text style={styles.infoText}>{itemChild.price}</Text>
                                                        <Text style={styles.infoText}>{itemChild.quantity}</Text>
                                                    </View>

                                                </View>
                                            )
                                        })}
                                    </Card>
                                )
                            }}

                        />
                    </ScrollView>
                </View>
            </View>

        );

    }
}

const mapStateToProps = state => {
    return {
        uid: state.home.uid
    }
}

export default connect(mapStateToProps)(OrdersScreen)

const styles = StyleSheet.create({

    notch: {
        backgroundColor: "#000",
        paddingTop: StatusBar.currentHeight
    },
    listItem: {
        flexDirection: "row",
        padding: 20
    },
    contactIcon: {
        width: 60,
        height: 60,
        borderRadius: 100
    },
    infoContainer: {
        flexDirection: "column"
    },
    infoText: {
        fontSize: 16,
        fontWeight: "400",
        paddingLeft: 10,
        paddingTop: 2
    },
    floatButton: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        backgroundColor: "#B83227",
        borderRadius: 100,
    }
})
