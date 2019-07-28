import React, { Component } from 'react'
import { View, StyleSheet, Platform, StatusBar, Text } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Card, CardItem, Content } from "native-base";
import { connect } from "react-redux";
import { logoutUser } from "../src/actions";

class SettingsScreen extends Component {

    onButtonPress = () => {

        const { navigation } = this.props

        this.props.logoutUser(navigation);
    }

    renderNotch = () => {
        if (Platform.OS === "android") {
            return (
                <View style={styles.notch} />
            )
        }
    }

    render() {

        console.log(this.props.isAdmin, this.props.email)

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

                <Card>
                    <CardItem>
                        <Text>{this.props.email}</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                {this.props.isAdmin === true ? "Admin" : "Star User"}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
                <View>
                    <Button
                        style={{ margin: 10 }}
                        light
                        danger
                        block
                        onPress={this.onButtonPress}
                    >
                        <Icon name='md-exit' style={{ color: "#FFFFFF" }} />
                        <Text style={{ fontSize: 20, color: "#FFFFFF" }}>Logout</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        email: state.home.email,
        isAdmin: state.home.isAdmin
    }
}

export default connect(mapStateToProps, { logoutUser })(SettingsScreen)

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
