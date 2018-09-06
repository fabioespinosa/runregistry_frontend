import axios from 'axios';
const INITIAL_INFO = 'INITIAL_INFO';

export const initializeUser = (store, query) => {
    axios.defaults.headers.common = {
        'adfs-group': query['adfs-group']
    };
    store.dispatch({
        type: INITIAL_INFO,
        payload: query
    });
};

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case INITIAL_INFO:
            return { ...state, ...payload };
        default:
            return state;
    }
}
