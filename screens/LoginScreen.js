import React, { Component } from 'react';
import { Text, View, StatusBar, ActivityIndicator, StyleSheet } from 'react-native';
import { Form, Input, Item, Label, Button } from "native-base";
import { connect } from "react-redux";
import * as firebase from "firebase";
import AnimatedLoader from 'react-native-animated-loader';
import { onEmailChange, onPasswordChange, loginUser } from '../src/actions'

class LoginScreen extends Component {

    static navigationOptions = {
        drawerLockMode: 'locked-closed'
    }

    state = {
        isLoading: true
    }

    componentWillMount() {
        firebase
            .auth()
            .onAuthStateChanged(user => {
                if (user) {
                    this.setState({ isLoading: false })
                    this.props.navigation.navigate("Home");
                } else {
                    this.setState({ isLoading: false })
                }
            })
    }

    onButtonPress = () => {
        const { email, password } = this.props;
        this.props.loginUser({ email, password }, this.props);
    }

    renderButton = () => {
        if (this.props.loading) {
            return <ActivityIndicator
                size="large"
            />
        }

        return (

            <Button
                style={{ margin: 10, justifyContent: "center", alignItems: "center" }}
                onPress={this.onButtonPress}
            >
                <Text style={{ color: "#FFFFFF" }}> Submit </Text>
            </Button>
        )
    }

    render() {

        if (this.state.isLoading) {
            return (

                <View style={styles.container}>
                    <AnimatedLoader visible={this.state.isLoading} overlayColor="rgba(255,255,255,0.75)" speed={1} source={require("../assets/8030-faer-raund.json")} animationStyle={styles.lottie} />
                </View>

            )
        }

        return (
            <View>
                <View style={{ paddingTop: StatusBar.currentHeight, backgroundColor: "#000" }} />
                <Text style={{ fontSize: 35 }}>Welcome to Shopping App </Text>

                <Form>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                            value={this.props.email}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={text => { this.props.onEmailChange(text) }}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Password</Label>
                        <Input
                            value={this.props.password}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={text => { this.props.onPasswordChange(text) }}
                            secureTextEntry
                        />
                    </Item>
                </Form>
                <View style={{ justifyContent: "center", alignItems: "center", margin: 10 }}>
                    <Text style={{ fontSize: 20, color: "red" }}> {this.props.error} </Text>
                </View>
                {this.renderButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', },
    lottie: { width: 100, height: 100,  backfaceVisibility:'hidden'}
})

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        password: state.auth.password,
        error: state.auth.error,
        loading: state.auth.loading,
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { onEmailChange, onPasswordChange, loginUser })(LoginScreen)



