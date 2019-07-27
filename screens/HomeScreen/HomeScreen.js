import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, TouchableOpacity, ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import { connect } from "react-redux";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Item, Input, Card } from "native-base";
import { searchChange } from "../../src/actions";
import * as firebase from "firebase";

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            isListEmpty: false
        };
    }

    componentWillMount() {
        this.getAllProducts()
    }

    getAllProducts = () => {
        let self = this;

        let productRef = firebase
            .database()
            .ref('/products')
        productRef
            .on("value", dataSnapshot => {
                if (dataSnapshot.val()) {
                    let productResult = Object.values(dataSnapshot.val())
                    console.log("ProductResult", productResult)
                    let productKey = Object.keys(dataSnapshot.val())
                    console.log("ProductKey", productKey)
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
                        Products loading please wait..
            </Text>
                </View>
            );
        } else if (this.state.isListEmpty) {

            return (

                <Container>
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
                            <Title>Shopping App</Title>
                        </Body>
                        <Right>
                            <Button
                                transparent
                                onPress={() => { this.props.navigation.navigate("Cart") }}
                            >
                                <Icon name='cart' />
                            </Button>
                        </Right>

                    </Header>
                    <Item style={{ padding: 10 }}>
                        <Input
                            placeholder="Search"
                            value={this.props.searchText}
                            onChangeText={text => this.props.searchChange(text)}
                            style={{ margin: 5 }}
                        />
                        <TouchableOpacity>
                            <Icon name="md-search" />
                        </TouchableOpacity>
                    </Item>
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
                    >
                        <Text style={{ textAlign: "center" }}>No Products Found!</Text>
                    </View>
                </Container>


            );
        }

        return (
            <Container>
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
                        <Title>Shopping App</Title>
                    </Body>
                    <Right>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.navigate("Cart") }}
                        >
                            <Icon name='cart' />
                        </Button>
                    </Right>

                </Header>
                <View>
                    <Item style={{ padding: 10 }}>
                        <Input
                            placeholder="Search"
                            value={this.props.searchText}
                            onChangeText={text => this.props.searchChange(text)}
                            style={{ margin: 5 }}
                        />
                        <TouchableOpacity>
                            <Icon name="md-search" />
                        </TouchableOpacity>
                    </Item>
                </View>
                <View>
                    <View>
                            <FlatList
                                data={this.state.data}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => { }}
                                        >
                                            <Card style={styles.listItem}>
                                                <View>
                                                    <Image
                                                        style={styles.contactIcon}
                                                        source={
                                                            item.imageUrl === "empty"
                                                                ? require("../../assets/person.png")
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
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                    </View>
                </View>
            </Container>

        );
    }
}

const mapStateToProps = state => {
    return {
        searchText: state.home.text,
    }
}

export default connect(mapStateToProps, { searchChange })(HomeScreen);

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
        borderRadius: 100
    }
})