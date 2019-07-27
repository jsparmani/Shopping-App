import { EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS } from "./types";
import * as firebase from "firebase";

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

    props.navigation.navigate("Home")

}

const loginUserFail = dispatch => {
    dispatch({ type: LOGIN_USER_FAIL })
}