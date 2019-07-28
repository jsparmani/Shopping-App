import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, TouchableOpacity, ActivityIndicator, FlatList, Image, ScrollView, Alert } from 'react-native';
import { connect } from "react-redux";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Item, Input, Card } from "native-base";
import { searchChange } from "../../src/actions";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";


class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            arrayHolder: [],
            isLoading: true,
            isListEmpty: false,
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

                    let productKey = Object.keys(dataSnapshot.val())

                    productKey.forEach((value, key) => {
                        productResult[key]["key"] = value;
                    })

                    self.setState({ isListEmpty: false, data: productResult, arrayHolder: productResult })
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

    searchFilterFunction = text => {

        if (!text) {
            this.setState({ arrayHolder: this.state.data })
            return true;
        }

        const newData = this.state.data.filter(item => {
            const itemData = `${item.name.toUpperCase()} ${item.description.toUpperCase()}`;
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1;
        });


        this.setState({ arrayHolder: newData });
    }

    renderHeader = () => {
        return (
            <View>
                <Item style={{ padding: 10 }}>
                    <Input
                        placeholder="Search"
                        value={this.props.searchText}
                        autoCorrect={false}
                        onChangeText={text => {
                            this.props.searchChange(text);
                            this.searchFilterFunction(text);
                        }}
                        style={{ margin: 5 }}
                    />
                    <TouchableOpacity>
                        <Icon name="md-search" />
                    </TouchableOpacity>
                </Item>
            </View>
        )
    }

    renderCart = () => {
        if (!this.props.isAdmin) {
            return (
                <Right>
                    <Button
                        transparent
                        onPress={() => { this.props.navigation.navigate("Cart") }}
                    >
                        <Icon name='cart' />
                    </Button>
                </Right>
            )
        }
    }

    renderSelector = () => {
        if (this.props.isAdmin) {
            return (
                <TouchableOpacity onPress={() => { Alert.alert("Cross Pressed") }}>
                    <Entypo style={{ marginTop: 35, paddingRight: 10 }} name="cross" size={25} />
                </TouchableOpacity>
            )
        } else {
            return <Entypo style={{ marginTop: 35, paddingRight: 10 }} name="plus" size={25} />;
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
                            <Title>Shopping App</Title>
                        </Body>
                        {this.renderCart()}

                    </Header>
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
                    >
                        <Text style={{ textAlign: "center" }}>No Products Found!</Text>
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
                            <Title>Shopping App</Title>
                        </Body>

                        {this.renderCart()}

                    </Header>
                </View>
                <View style={{ flex: 10 }}>
                    <ScrollView>
                        <FlatList
                            ListHeaderComponent={this.renderHeader()}
                            data={this.state.arrayHolder}
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
                                            <View style={styles.entypoContainer}>
                                                {this.renderSelector()}
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                );
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
        searchText: state.home.text,
        isAdmin: state.home.isAdmin
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
        borderRadius: 100,
    },
    entypoContainer: {
        position: "absolute",
        right: 0,
        marginLeft: "auto",
    }
})