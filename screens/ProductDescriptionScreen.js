import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    Image,
    StatusBar,
    Dimensions
} from "react-native";
import { Header, Title, Left, Icon, Right, Button, Body, Card, CardItem, Textarea } from "native-base";
import { Entypo } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Lightbox } from "react-modal-image";

export default class ProductDescriptionScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            key: null,
            open: true
        }
    }

    closeLightbox = () => {
        this.setState({ open: false })
    }

    componentWillMount() {
        let key = this.props.navigation.getParam("key", "");
        this.getProduct(key)
    }

    getProduct = async key => {
        firebase
            .database()
            .ref(`products/${key}`)
            .on('value', dataSnapshot => {
                if (dataSnapshot.val()) {
                    let product = dataSnapshot.val()
                    this.setState({
                        name: product.name,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        description: product.description,
                        key: key,
                        isLoading: false
                    });
                }
            })
    }

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
                    style={{
                        flex: 1,
                        alignContent: "center",
                        justifyContent: "center"
                    }}
                >
                    <ActivityIndicator size="large" color="#B83227" />
                    <Text style={{ textAlign: "center" }}>
                        Product loading please wait..
                </Text>
                </View>
            );
        }
        // else show contact details
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
                            <Title>Product</Title>
                        </Body>
                        <Right />
                    </Header>

                </View>
                <View style={{ flex: 9 }}>
                    <ScrollView style={styles.container}>
                        <View style={styles.contactIconContainer}>
                            <TouchableOpacity
                                onLongPress={() => {
                                    return (
                                        <Lightbox
                                            medium={this.state.imageUrl}
                                            large={this.state.imageUrl}
                                            onClose={this.closeLightbox}
                                        />
                                    )
                                }}
                            >
                                <Image
                                    style={styles.contactIcon}
                                    source={
                                        this.state.imageUrl === "empty"
                                            ? require("../assets/person.png")
                                            : {
                                                uri: this.state.imageUrl
                                            }
                                    }
                                />
                            </TouchableOpacity>
                            <View style={styles.nameContainer}>
                                <Text style={styles.name}>
                                    {this.state.name}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Card>
                                <CardItem bordered>
                                    <Text style={styles.infoText}> Price </Text>
                                </CardItem>
                                <CardItem bordered>
                                    <Text style={styles.infoText}>
                                        {`${this.state.price}         `}
                                    </Text>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem bordered>
                                    <Text style={styles.infoText}> Description </Text>
                                </CardItem>
                                <CardItem bordered>
                                    <Textarea
                                        disabled
                                        style={styles.infoText}
                                    >
                                        {this.state.description}
                                    </Textarea>
                                </CardItem>
                            </Card>
                        </View>
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
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    contactIconContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    contactIcon: {
        // to create a square box both height and width should be same
        height: Dimensions.get("window").width,
        width: Dimensions.get("window").width
    },
    nameContainer: {
        width: "100%",
        height: 70,
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.5)",
        justifyContent: "center",
        position: "absolute",
        bottom: 0
    },
    name: {
        fontSize: 24,
        color: "#000",
        fontWeight: "900"
    },
    infoText: {
        fontSize: 18,
        fontWeight: "300"
    },
    actionContainer: {
        flexDirection: "row"
    },
    actionButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    actionText: {
        color: "#B83227",
        fontWeight: "900"
    }
});
