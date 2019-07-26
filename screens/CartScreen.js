import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, Platform } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body } from "native-base";

export default class CartScreen extends Component {

    renderNotch = () => {
        if (Platform.OS === "android") {
            return (
                <View style={styles.notch} />
            )
        }
    }

    render() {
        return (
            <Container>
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

            </Container>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center"
    },
    notch: {
        backgroundColor: "#000",
        paddingTop: StatusBar.currentHeight
    }
})