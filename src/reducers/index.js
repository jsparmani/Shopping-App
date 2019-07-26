import { combineReducers } from "redux";
import HomeReducer from "./HomeReducer";
import AuthReducer from "./AuthReducer";

export default combineReducers({
    home: HomeReducer,
    auth: AuthReducer
})