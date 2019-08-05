import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Image,
    TouchableWithoutFeedback, StatusBar,
    TextInput, SafeAreaView, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, ActivityIndicator
} from 'react-native'
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

        const { navigation } = this.props
        navigation.addListener("willFocus", () => {
            firebase
                .auth()
                .onAuthStateChanged(user => {
                    if (user) {
                        this.props.navigation.navigate("Home");
                    }
                })
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

            <TouchableOpacity style={styles.buttonContainer} onPress={this.onButtonPress}>
                <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
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
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView behavior='padding' style={styles.container}>
                    <TouchableWithoutFeedback style={styles.container}
                        onPress={Keyboard.dismiss}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoContainer}>
                                <Image style={styles.logo}
                                    source={require('../assets/icon.png')}>
                                </Image>
                                <Text style={styles.title}>Account Information</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <TextInput style={styles.input}
                                    placeholder="Enter username/email"
                                    placeholderTextColor='rgba(255,255,255,0.8)'
                                    keyboardType='email-address'
                                    returnKeyType='next'
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    value={this.props.email}
                                    onChangeText={text => this.props.onEmailChange(text)}
                                    onSubmitEditing={() => this.refs.txtPassword.focus()}
                                />
                                <TextInput style={styles.input}
                                    onChangeText={text => this.props.onPasswordChange(text)}
                                    value={this.props.password}
                                    placeholder="Enter password"
                                    placeholderTextColor='rgba(255,255,255,0.8)'
                                    returnKeyType='go'
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    ref={"txtPassword"}
                                />
                                <View>
                                    <Text style={{ fontSize: 25, color: "red" }}> {this.props.error} </Text>
                                    {this.renderButton()}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    lottie: { width: 100, height: 100, backfaceVisibility: 'hidden' },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        color: '#f7c744',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
        opacity: 0.9
    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 250,
        padding: 20,
        // backgroundColor: 'red'
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#FFF',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 18
    }
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
