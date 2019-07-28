import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Keyboard, Image, ActivityIndicator, Alert } from 'react-native';
import { Container, Header, Title, Left, Icon, Button, Body, Item, Input, Form, Textarea, Label } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import uuid from "uuid";

INITIAL_STATE = {
    name: "",
    price: "",
    description: "",
    image: "empty",
    imageDownloadUrl: "empty",
    isUploading: false
}

export default class Add_ItemScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            price: "",
            description: "",
            image: "empty",
            imageDownloadUrl: "empty",
            isUploading: false
        }
    }

    saveProduct = async () => {

        const { name, price, image, description } = this.state;

        if (name !== "" && price !== "" && description !== "") {
            this.setState({ isUploading: true });
            const dbRef = firebase
                .database()
                .ref('/products');
            const storageRef = firebase
                .storage()
                .ref()

            if (image !== "empty") {
                const imageUrl = await this.uploadImageAsync(image, storageRef);

                this.setState({ imageDownloadUrl: imageUrl })
            }



            let product = {
                name: name,
                price: price,
                description: description,
                imageUrl: this.state.imageDownloadUrl,

            }

            await dbRef.push(product, error => {
                if (!error) {

                } else {
                    console.log(error)
                }
            })

        } else {
            Alert.alert("All fields are required")
        }

        this.setState({ ...INITIAL_STATE });
    };

    uploadImageAsync = async (uri, storageRef) => {
        const parts = uri.split(".");
        const fileExtension = parts[parts.length - 1];

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response)
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network Request Failed"))
            }
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        })

        const ref = storageRef
            .child("ProductImages")
            .child(uuid.v4() + "." + fileExtension)
        const snapshot = await ref.put(blob);

        blob.close()

        const imgUrl = await snapshot.ref.getDownloadURL()
            .then(url => {
                const downloadUrl = url;

                return downloadUrl
            })
        return imgUrl
    };


    renderNotch = () => {
        if (Platform.OS === "android") {
            return (
                <View style={styles.notch} />
            )
        }
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.2,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1]
        });
        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    }

    render() {

        if (this.state.isUploading) {
            return (
                <View
                    style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
                >
                    <ActivityIndicator size="large" color="#B83227" />
                    <Text style={{ textAlign: "center" }}>
                        Product Uploading please wait..
                    </Text>
                </View>
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
                        <Title>Add Item</Title>
                    </Body>
                </Header>

                <TouchableWithoutFeedback
                    onPress={() => {
                        // dismiss the keyboard if touch any other area then input
                        Keyboard.dismiss();
                    }}
                >
                    <ScrollView style={styles.container}>
                        <TouchableOpacity
                            onPress={() => {
                                this.pickImage();
                            }}
                        >
                            <Image
                                source={
                                    this.state.image === "empty"
                                        ? require("../assets/person.png")
                                        : {
                                            uri: this.state.image
                                        }
                                }
                                style={styles.imagePicker}
                            />
                        </TouchableOpacity>

                        <Form>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>Name</Label>
                                <Input
                                    autoCorrect={false}
                                    keyboardType="default"
                                    value={this.state.name}
                                    onChangeText={name => this.setState({ name })}
                                />
                            </Item>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>Price</Label>
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    value={this.state.price}
                                    keyboardType="number-pad"
                                    onChangeText={price => this.setState({ price })}
                                />
                            </Item>
                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder="Description"
                                style={{ margin: 10 }}
                                onChangeText={description => this.setState({ description })}
                                value={this.state.description}
                            />
                        </Form>

                        <Button
                            style={styles.button}
                            full
                            rounded
                            onPress={() => {
                                // save contact
                                this.saveProduct()
                            }}
                        >
                            <Text style={styles.buttonText}> Save </Text>
                        </Button>
                    </ScrollView>
                </TouchableWithoutFeedback>


            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 10
    },
    imagePicker: {
        justifyContent: "center",
        alignSelf: "center",
        width: 100,
        height: 100,
        borderRadius: 100,
        borderColor: "#c1c1c1",
        borderWidth: 2
    },
    inputItem: {
        margin: 10
    },
    button: {
        backgroundColor: "#B83227",
        marginTop: 40
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    notch: {
        backgroundColor: "#000",
        paddingTop: StatusBar.currentHeight
    },
});
