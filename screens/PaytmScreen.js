import React, { Component } from 'react'
import { Text, View, WebView, Platform, StatusBar, StyleSheet } from 'react-native'
import uuid from "uuid";
import { connect } from "react-redux";
import { Header, Title, Left, Icon, Right, Button, Body, Footer, FooterTab } from "native-base";
import AnimatedLoader from 'react-native-animated-loader';
import * as firebase from "firebase";

class PaytmScreen extends Component {

    state = {
        showModal: false,
        ack: "",
        ORDER_ID: uuid.v4(),
        TXN_AMOUNT: "",
        CUST_ID: this.props.email,
        visible: false,
        visibleFail: false,
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
        if (title === 'true' && url === 'https://pay-paytm.herokuapp.com/api/paytm/response') {
            this.setOrder();
            setTimeout(() => {
                this.setState({ visible: false })
                this.props.navigation.navigate("Orders")
            }, 3000)
            this.setState({ visible: true })
        } else if (title === 'false') {
            setTimeout(() => {
                this.setState({ visibleFail: false })
                this.props.navigation.navigate("Home")
            }, 3000)
            this.setState({ visibleFail: true })
        }
    }

    render() {

        if (!this.state.visible && !this.state.visibleFail) {
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
                            source={{ uri: 'https://pay-paytm.herokuapp.com/api/paytm/request' }}
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

        if (this.state.visibleFail) {
            return (
                <View style={styles.container}>
                    <AnimatedLoader visible={this.state.visibleFail} overlayColor="rgba(255,255,255,0.75)" speed={1} source={require("../assets/4970-unapproved-cross.json")} animationStyle={styles.lottie} />
                    <Text> Transaction failed </Text>
                </View>
            )
        }

        if (this.state.visible) {
            return (
                <View style={styles.container}>
                    <AnimatedLoader visible={this.state.visible} overlayColor="rgba(255,255,255,0.75)" speed={1} source={require("../assets/972-done.json")} animationStyle={styles.lottie} />
                    <Text> Transaction Successfull </Text>
                </View>
            )
        }
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    lottie: {
        width: 100,
        height: 100,
    }
})

