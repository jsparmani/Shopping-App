import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { AsyncStorage } from "react-native";
import axios from "axios"

const PUSH_ENDPOINT = "http://rallycoding.herokuapp.com/api/tokens";

export default async () => {
    let previousToken = await AsyncStorage.getItem('push_token')
    console.log(previousToken)
    if(previousToken) {
        return;
    } else {
        const { status } =  await Permissions.askAsync(Permissions.NOTIFICATIONS);

        if (status !== 'granted') {
            return;
        }

        let token = await Notifications.getExpoPushTokenAsync();
        console.log(token)
        await axios.post(PUSH_ENDPOINT, { token: { token } });
        AsyncStorage.setItem('push_token', token);
    }
}