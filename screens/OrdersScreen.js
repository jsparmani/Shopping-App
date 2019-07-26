import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class OrdersScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text> Order Screen </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center"
    }
})
