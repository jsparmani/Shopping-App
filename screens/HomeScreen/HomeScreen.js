import React, { Component } from 'react'
import { View, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Item, Input } from "native-base";
import { searchChange } from "../../src/actions";

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
                <Item style={{ padding: 10 }}>
                    <Input
                        placeholder="Search"
                        value={this.props.searchText}
                        onChangeText={text => this.props.searchChange(text)}
                        style={{ margin: 5 }}
                    />
                    <TouchableOpacity>
                        <Icon name="md-search" />
                    </TouchableOpacity>
                </Item>
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
})