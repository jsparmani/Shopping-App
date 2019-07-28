import { SEARCH_TEXT_CHANGED, USER_CHECK } from "./types";

export const searchChange = text => {
    return {
        type: SEARCH_TEXT_CHANGED,
        payload: text
    }
}

export const userCheck = (user, uid, email) => {
    return {
        type: USER_CHECK,
        payload: { user, uid, email }
    }
}