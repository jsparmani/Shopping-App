import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Header, Title, Left, Icon, Right, Button, Body, FooterTab, Footer, CardItem, Card } from "native-base";
import { Ionicons, Foundation } from "@expo/vector-icons";

export default class CheckoutScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }

    componentDidMount() {
        const total = this.props.navigation.getParam("total", 0)
        this.setState({ total })
    }

    renderNotch = () => {
        if (Platform.OS === "android") {
            return (
                <View style={styles.notch} />
            )
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
                            <Title>Checkout</Title>
                        </Body>
                        <Right />
                    </Header>
                </View>
                <View style={{ flex: 8 }}>
                    <Card style={{ marginTop: 10 }}>
                        <TouchableOpacity>
                            <CardItem >
                                <Icon active name="md-cash" />
                                <Text> Pay On Delivery </Text>
                                <Right>
                                    <Icon name="arrow-forward" style={styles.arrow} />
                                </Right>
                            </CardItem>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=> this.props.navigation.navigate('CreditCard')}
                        >
                            <CardItem  >
                                <Icon active name="md-card" />
                                <Text> Credit / Debit  Card </Text>
                                <Right>
                                    <Icon name="arrow-forward" style={styles.arrow} />
                                </Right>
                            </CardItem>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CardItem >
                                <Foundation name="paypal" size={26} />
                                <Text>    Paytm </Text>
                                <Right>
                                    <Icon name="arrow-forward" style={styles.arrow} />
                                </Right>
                            </CardItem>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CardItem  >
                                <Ionicons name="md-wallet" size={26} />
                                <Text>  Shopping Wallet </Text>
                                <Right>
                                    <Icon name="arrow-forward" style={styles.arrow} />
                                </Right>
                            </CardItem>
                        </TouchableOpacity>
                    </Card>
                </View>

                <View>
                    <Footer>
                        <FooterTab>
                            <Button full>
                                <Text style={{ fontSize: 15, color: 'white' }}> Total : {this.state.total} </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    notch: {
        backgroundColor: "#000",
        paddingTop: StatusBar.currentHeight
    },
    arrow: {
        marginLeft: "auto"

    }
})