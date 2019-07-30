import React from 'react';
import { Text, View, StyleSheet, Platform, StatusBar, UIManager } from 'react-native';
import { Header, Title, Left, Icon, Right, Button, Body, Footer, FooterTab } from "native-base";
import { CreditCardInput } from "react-native-credit-card-input";
import AnimatedLoader from 'react-native-animated-loader';
import * as firebase from "firebase";
import { connect } from "react-redux";

class CreditCardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
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

    }

    renderScreen = () => {
        if (!this.state.visible) {
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
                                <Title>Pay</Title>
                            </Body>
                            <Right />
                        </Header>
                    </View>
                    <View style={{ flex: 9 }}>
                        <CreditCardInput
                            autoFocus
                            requiresName
                            requiresCVC
                            valid color="black"
                            invalid color="red"
                            placeholder Color="dark gray"
                        />
                    </View>
                    <Footer>
                        <FooterTab>
                            <Button full
                                onPress={() => {
                                    this.setOrder();
                                    setTimeout(() => {
                                        this.setState({ visible: false })
                                        this.props.navigation.navigate("Home")
                                    }, 3000)
                                    this.setState({ visible: true })
                                    firebase
                                        .database()
                                        .ref(`cart/${this.props.uid}/products`)
                                        .remove()
                                    firebase
                                        .database()
                                        .ref(`cart/${this.props.uid}/price`)
                                        .set(0)
                                }}
                            >
                                <Text style={{ fontSize: 15, color: 'white' }}> Confirm </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <AnimatedLoader visible={this.state.visible} overlayColor="rgba(255,255,255,0.75)" speed={1} source={require("../assets/972-done.json")} animationStyle={styles.lottie} />
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderScreen()}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    lottie: {
        width: 100,
        height: 100,
    }
})

const mapStateToProps = state => {
    return {
        uid: state.home.uid
    }
}


export default connect(mapStateToProps)(CreditCardScreen)
