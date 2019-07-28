import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import { Header, Title, Left, Icon, Right, Button, Body, Card } from "native-base";
import { connect } from "react-redux";
import * as firebase from "firebase";

class CartScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            isListEmpty: false,
        };
    }

    componentWillMount() {
        this.getAllCartItems()
    }

    getAllCartItems = () => {
        let self = this;

        let cartRef = firebase
            .database()
            .ref(`/cart/${this.props.uid}/products`)
        cartRef
            .on("value", dataSnapshot => {
                console.log(dataSnapshot.val())
                if (dataSnapshot.val()) {
                    let productResult = Object.values(dataSnapshot.val())

                    let productKey = Object.keys(dataSnapshot.val())

                    productKey.forEach((value, key) => {
                        productResult[key]["key"] = value;
                    })


                    self.setState({ isListEmpty: false, data: productResult })
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
                        Cart loading please wait..
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
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Cart</Title>
                        </Body>

                    </Header>
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
                    >
                        <Text style={{ textAlign: "center" }}>Your cart is empty!</Text>
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
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Cart</Title>
                        </Body>
                        <Right />
                    </Header>
                </View>
                <View style={{ flex: 9 }}>
                    <ScrollView>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) => {
                                return (

                                    <Card style={styles.listItem}>
                                        <View>
                                            <Image
                                                style={styles.contactIcon}
                                                source={
                                                    item.imageUrl === "empty"
                                                        ? require("../assets/person.png")
                                                        : { uri: item.imageUrl }
                                                }
                                            />
                                        </View>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.infoText}>{item.price}</Text>
                                        </View>
                                    </Card>

                                );
                            }}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }
}


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
    },
    entypoContainer: {
        position: "absolute",
        right: 0,
        marginLeft: "auto",
    }
})

const mapStateToProps = state => {
    return {
        uid: state.home.uid
    }
}

export default connect(mapStateToProps)(CartScreen);