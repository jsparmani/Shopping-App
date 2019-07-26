import { SEARCH_TEXT_CHANGED } from "./types";

export const searchChange = text => {
    return {
        type: SEARCH_TEXT_CHANGED,
        payload: text
    }
}