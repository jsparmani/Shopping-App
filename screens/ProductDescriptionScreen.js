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
    Dimensions,
    Animated, PanResponder
} from "react-native";
import { Header, Title, Left, Icon, Right, Button, Body, Card, CardItem, Textarea, Footer, FooterTab } from "native-base";
import { Entypo } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Lightbox } from "react-modal-image";
import { connect } from "react-redux";

class ProductDescriptionScreen extends Component {

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

    renderFooter = () => {

        if (this.props.isAdmin) {
            return (
                <Footer>
                    <FooterTab>
                        <Button full
                            onPress={() => {
                                this.props.navigation.navigate("EditProduct", {
                                    key: this.state.key
                                })
                            }}
                        >
                            <Text style={{ fontSize: 15, color: 'white' }}> Edit </Text>
                        </Button>
                    </FooterTab>
                </Footer>
            )
        }
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
                                    return (<Animated.View style={[StyleSheet.absoluteFill, styles.modal]} pointerEvents="none">
                                        <View style={styles.modalContainer}>
                                            <View style={styles.header}>
                                                <Text>Jason Brown</Text>
                                            </View>
                                            <Image source={picture} style={styles.image} resizeMode="cover" />
                                            <View style={styles.footer}>
                                                <View style={styles.footerContent}>
                                                    <Text style={styles.text}>Like</Text>
                                                    <Text style={styles.text}>Comment</Text>
                                                    <Text style={styles.text}>Share</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Animated.View>
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
                {this.renderFooter()}
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
    },
    modal: {
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer: {
        width: "90%",
        height: "60%",
    },
    header: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        overflow: "hidden",
        padding: 8,
    },
    footer: {
        backgroundColor: "#FFF",
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        overflow: "hidden",
        padding: 8,
    },
    footerContent: {
        justifyContent: "space-around",
        flexDirection: "row",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    text: {
        flex: 1,
        fontSize: 18,
        textAlign: "center",
    },
    bold: {
        fontWeight: "bold",
    }
});

const mapStateToProps = state => {
    return {
        isAdmin: state.home.isAdmin
    }
}

export default connect(mapStateToProps)(ProductDescriptionScreen)