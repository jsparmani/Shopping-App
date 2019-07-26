import React, { Component } from 'react'
import { View, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Form, Item, Input, Label } from "native-base";
import { searchChange } from "../../src/actions";
import { Ionicons } from '@expo/vector-icons';

class HomeScreen extends Component {

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
                        <Title>Shopping App</Title>
                    </Body>
                    <Right>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.navigate("Cart") }}
                        >
                            <Icon name='cart' />
                        </Button>
                    </Right>
                </Header>
                <View style={{flexDirection:'row'}}>
                <Form style={{flex:4}} >
                    <Item floatingLabel style={styles.search}>
                        <Label style={{ marginLeft: 10, marginBottom: 2 }}>Search Item</Label>
                        <Input 
                            value={this.props.searchText}
                            onChangeText={text => this.props.searchChange(text)}
                        />
                    </Item>
                </Form>
                <TouchableOpacity >
                    <Ionicons name="md-search" size={32} style={{flex:2, marginTop:24,marginRight:10}}/>
                </TouchableOpacity>
                </View>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        searchText: state.home.text,
    }
}

export default connect(mapStateToProps, { searchChange })(HomeScreen);

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
    search: {
        margin: 10,
        borderColor: '#192A56',
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderBottomWidth: 2

    }
})