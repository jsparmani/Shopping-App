import React, { Component } from 'react'
import { View, StyleSheet, Platform, StatusBar, Text } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body } from "native-base";

export default class SettingsScreen extends Component {

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
                            onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>App Settings</Title>
                    </Body>
                    <Right />

                </Header>
                <View style={{ margin: 20 }}>
                    <Button 
                        light
                        danger
                        block
                    >
                        <Icon name='md-exit' style={{ color: "#FFFFFF" }} />
                        <Text style={{ fontSize: 20, color: "#FFFFFF" }}>Logout</Text>
                    </Button>
                </View>
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
    },
})
