import React from "react";
import HomeScreen from "./HomeScreen.js";
import OrdersScreen from "../OrdersScreen";
import SettingsScreen from "../SettingsScreen";
import LoginScreen from "../LoginScreen";
import CheckoutScreen from '../CheckoutScreen';
import Add_ItemScreen from "../Add_ItemScreen";
import SideBar from "../Sidebar.js";
import { createDrawerNavigator, createAppContainer, createStackNavigator } from "react-navigation";
import CartScreen from "../CartScreen.js";
import ProductDescriptionScreen from "../ProductDescriptionScreen.js";
import CreditCardScreen from "../CreditCardScreen.js";
import EditProductScreen from "../EditProductScreen.js";

const HomeStack = createStackNavigator(
    {
        Home: { screen: HomeScreen },
        Cart: { screen: CartScreen },
        Description: { screen: ProductDescriptionScreen },
        EditProduct: { screen: EditProductScreen },
        Checkout: { screen: CheckoutScreen},
        CreditCard: {screen: CreditCardScreen}
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
        Add_Item: { screen: Add_ItemScreen },
        Settings: { screen: SettingsScreen }
    },
    {
        initialRouteName: "Login",
        contentComponent: props => <SideBar {...props} />
    }
);

const App = createAppContainer(HomeScreenRouter)
export default App;