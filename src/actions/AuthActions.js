import { EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS, LOGOUT_USER } from "./types";
import * as firebase from "firebase";
import { Alert } from "react-native";

export const onEmailChange = email => {
    return {
        type: EMAIL_CHANGED,
        payload: email
    }
}

export const onPasswordChange = password => {
    return {
        type: PASSWORD_CHANGED,
        payload: password
    }
}

export const loginUser = ({ email, password }, props) => {

    return dispatch => {

        dispatch({ type: LOGIN_USER })

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => loginUserSuccess(dispatch, user, props))
            .catch(() => {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(user => loginUserSuccess(dispatch, user, props))
                    .catch(() => loginUserFail(dispatch))
            })
    }

}


const loginUserSuccess = (dispatch, user, props) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    })

    const { currentUser } = firebase.auth()
    firebase
        .database()
        .ref(`admin-users/${currentUser.uid}`)
        .on('value', snapshot => {
            if (!snapshot.val()) {
                firebase
                    .database()
                    .ref(`normal-users/${currentUser.uid}`)
                    .set({
                        email: currentUser.email
                    })
            }
        })




    priceRef = firebase
        .database()
        .ref(`cart/${currentUser.uid}/price`)
    priceRef
        .on("value", snapshot => {
            if (!snapshot.val()) {
                firebase
                    .database()
                    .ref(`admin-users/${currentUser.uid}`)
                    .on("value", dataSnapshot => {
                        if (!dataSnapshot.val()) {
                            priceRef.set(0)
                        }
                    })
            }
        })


    badgeRef = firebase
        .database()
        .ref(`cart/${currentUser.uid}/badge`)
    badgeRef
        .on("value", snapshot => {
            if (!snapshot.val()) {
                firebase
                    .database()
                    .ref(`admin-users/${currentUser.uid}`)
                    .on("value", dataSnapshot => {
                        if (!dataSnapshot.val()) {
                            badgeRef.set(0)
                        }
                    })
            }
        })

    firebase
        .database()
        .ref(`admin-users/${currentUser.uid}`).off()

    props.navigation.navigate("Home")

}

const loginUserFail = dispatch => {
    dispatch({ type: LOGIN_USER_FAIL })
}

export const logoutUser = navigation => dispatch => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            dispatch({
                type: LOGOUT_USER
            })
            navigation.navigate("Login");
        })
        .catch(() => { Alert.alert("Failed") })
}
