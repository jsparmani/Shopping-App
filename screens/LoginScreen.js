import React, { Component } from 'react'
import { Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { Form, Input, Item, Label, Button } from "native-base";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { onEmailChange, onPasswordChange, loginUser } from '../src/actions'

class LoginScreen extends Component {

    onButtonPress = () => {
        const { email, password } = this.props;
        this.props.loginUser({ email, password });
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
                            value={this.props.pass}
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

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        pass: state.auth.password,
        error: state.auth.error,
        loading: state.auth.loading
    }
}

export default connect(mapStateToProps, { onEmailChange, onPasswordChange, loginUser })(LoginScreen)