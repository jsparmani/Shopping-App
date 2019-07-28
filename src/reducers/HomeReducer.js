import { SEARCH_TEXT_CHANGED, USER_CHECK } from "../actions/types";


const INITIAL_STATE = {
    text: "",
    isAdmin: false,
    email: "",
    uid: ""
}

export default (state = INITIAL_STATE, action) => {


    switch(action.type) {
        case SEARCH_TEXT_CHANGED:
            return { ...state, text: action.payload }
        case USER_CHECK:
            return { ...state, isAdmin: action.payload.user, email: action.payload.email, uid: action.payload.uid }
        default: 
            return state;
    }
}