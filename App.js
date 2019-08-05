import React, { Component } from "react";
import { Alert } from "react-native";
import Expo, { AppLoading, Font } from "expo";
import HomeScreen from "./screens/HomeScreen/index";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./src/reducers";
import * as firebase from "firebase";
import thunk from "redux-thunk";

console.disableYellowBox = true;

export default class App extends Component {

    componentWillMount() {
        var firebaseConfig = {
            apiKey: "AIzaSyCJO8tMd4aYi7_mIHhcOYqGHZG1EwfHje0",
            authDomain: "shopping-app-bd7b4.firebaseapp.com",
            databaseURL: "https://shopping-app-bd7b4.firebaseio.com",
            projectId: "shopping-app-bd7b4",
            storageBucket: "shopping-app-bd7b4.appspot.com",
            messagingSenderId: "751192903089",
            appId: "1:751192903089:web:93a589bf95e895c5"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    

    constructor() {
        super();
        this.state = {
            isReady: false
        };
    }
    async componentDidMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("native-base/Fonts/Ionicons.ttf")
        });
        this.setState({ isReady: true });
    }
    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        }
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(thunk))}>
                <HomeScreen />
            </Provider>
        );
    }
}