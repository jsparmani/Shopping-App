import React from "react";
import HomeScreen from "./HomeScreen.js";
import OrdersScreen from "../OrdersScreen";
import SettingsScreen from "../SettingsScreen";
import LoginScreen from "../LoginScreen";
import SideBar from "../Sidebar.js";
import { createDrawerNavigator, createAppContainer, createStackNavigator } from "react-navigation";
import CartScreen from "../CartScreen.js";

const HomeStack = createStackNavigator(
    {
        Home: { screen: HomeScreen },
        Cart: { screen: CartScreen }
    },
    {
        headerMode: "none"
    }
)

const HomeScreenRouter = createDrawerNavigator(
    {
        Login: { screen: LoginScreen },
        Home: HomeStack,
        Orders: { screen: OrdersScreen },
        Settings: { screen: SettingsScreen }
    },
    {
        initialRouteName: "Login",
        contentComponent: props => <SideBar {...props} />
    }
);

const App = createAppContainer(HomeScreenRouter)
export default App;