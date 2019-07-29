import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Title, Left, Icon, Right, Button, Body, Card , Footer,FooterTab} from "native-base";
import { connect } from "react-redux";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";

class CartScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            isListEmpty: false,
            total: 0
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
        priceRef = firebase.database().ref(`cart/${this.props.uid}/price`)
        cartRef
            .on("value", dataSnapshot => {
                if (dataSnapshot.val()) {
                    let productResult = Object.values(dataSnapshot.val())

                    let productKey = Object.keys(dataSnapshot.val())

                    productKey.forEach((value, key) => {
                        productResult[key]["key"] = value;
                    })

                    priceRef
                        .on("value", snapshot => {
                            self.setState({ total: snapshot.val() })
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


    changeQuantity = key => {
        let self = this
        ref = firebase.database().ref(`cart/${this.props.uid}/products/${key}`)
        priceRef = firebase.database().ref(`cart/${this.props.uid}/price`)
        ref.once("value", snapshot => {
            if (snapshot.val()) {
                let product = snapshot.val()
                let q = product.quantity
                if (q === 1) {
                    ref.remove()
                    priceRef
                        .once("value", dataSnapshot => {
                            let oldPrice = parseFloat(String(dataSnapshot.val()).replace(/[^\d]/g, ''))
                            let deductionAmount = parseFloat(String(product.price).replace(/[^\d]/g, ''))
                            priceRef.set(oldPrice - deductionAmount);
                        })
                } else {
                    product["quantity"] = q - 1;
                    ref.update(product)
                    priceRef
                        .once("value", dataSnapshot => {
                            let oldPrice = parseFloat(String(dataSnapshot.val()).replace(/[^\d]/g, ''))
                            let deductionAmount = parseFloat(String(product.price).replace(/[^\d]/g, ''))
                            priceRef.set(oldPrice - deductionAmount);
                        })
                }
                ref.off()

            }
        })

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
                <View style={{ flex: 8 }}>
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
                                            <Text style={styles.infoText}> Quantity: {item.quantity} </Text>
                                        </View>
                                        <View style={styles.entypoContainer}>
                                            <TouchableOpacity
                                                onPress={() => this.changeQuantity(item.key)}
                                            >
                                                <Entypo style={{ marginTop: 35, paddingRight: 10 }} name="circle-with-minus" size={25} />
                                            </TouchableOpacity>
                                        </View>
                                    </Card>

                                );
                            }}
                        />
                    </ScrollView>
                </View>
                <Footer>
                        <FooterTab>
                            <Button full
                                    onPress={()=>{this.props.navigation.navigate("Checkout",{
                                        total: this.state.total})}}
                            >
                                <Text style={{ fontSize:15, color:'white'}}> Total : {this.state.total} </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
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