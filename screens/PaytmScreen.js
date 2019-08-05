import React, { Component } from 'react'
import { Text, View, TouchableOpacity, WebView, Modal, Platform, StatusBar, StyleSheet } from 'react-native'
import uuid from "uuid";
import { connect } from "react-redux";
import { Header, Title, Left, Icon, Right, Button, Body, Card, Footer, FooterTab } from "native-base";
import * as firebase from "firebase";

class PaytmScreen extends Component {

    state = {
        showModal: false,
        ack: "",
        ORDER_ID: uuid.v4(),
        TXN_AMOUNT: "",
        CUST_ID: this.props.email

    }

    componentWillMount() {
        const TXN_AMOUNT = this.props.navigation.getParam("total");
        this.setState({ TXN_AMOUNT })
    }

    renderNotch = () => {
        if (Platform.OS === "android") {
            return (
                <View style={styles.notch} />
            )
        }

    }

    setOrder = () => {

        firebase
            .database()
            .ref(`cart/${this.props.uid}/products`)
            .once("value", snapshot => {
                if (snapshot.val()) {
                    let order = snapshot.val()
                    firebase
                        .database()
                        .ref(`orders/${this.props.uid}`)
                        .push(order)
                }
            })

        firebase
            .database()
            .ref(`cart/${this.props.uid}/products`)
            .remove()
        firebase
            .database()
            .ref(`cart/${this.props.uid}/price`)
            .set(0)

    }

    onNavigationStateChangedHandler = (title, url) => {
        console.log(title, url)
        if (title === 'true' && url === 'https://paytm-shopping-app.herokuapp.com/api/paytm/response') {
            this.setOrder();
            this.props.navigation.navigate("Orders")
        }
    }

    render() {

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
                            <Title>Paytm Checkout</Title>
                        </Body>
                        <Right />
                    </Header>
                </View>
                <View style={{ flex: 8 }}>

                    <WebView
                        source={{ uri: 'https://paytm-shopping-app.herokuapp.com/api/paytm/request' }}
                        injectedJavaScript={`
                            document.getElementById('ORDER_ID').value = "${this.state.ORDER_ID}";
                            document.getElementById('CUST_ID').value = "${this.state.CUST_ID}";
                            document.getElementById('TXN_AMOUNT').value = "${this.state.TXN_AMOUNT}";
                            document.getElementById('btn').click();
                        `}
                        onNavigationStateChange={data => this.onNavigationStateChangedHandler(data.title, data.url)}
                    />

                    <View>
                        <Footer>
                            <FooterTab>
                                <Button full>
                                    <Text style={{ fontSize: 15, color: 'white' }}> Total : {this.state.TXN_AMOUNT} </Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </View>
                </View>
            </View>
        )


    }
}

const mapStateToProps = state => {
    return {
        email: state.home.email,
        uid: state.home.uid
    }
}

export default connect(mapStateToProps)(PaytmScreen);


const styles = StyleSheet.create({

    notch: {
        backgroundColor: "#000",
        paddingTop: StatusBar.currentHeight
    },
})

