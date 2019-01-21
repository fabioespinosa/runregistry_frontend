import axios from 'axios';
const INITIAL_INFO = 'INITIAL_INFO';
const INITIALIZE_ENVIRONMENT = 'INITIALIZE_ENVIRONMENT';

export const initializeUser = (store, query) => {
    store.dispatch({
        type: INITIAL_INFO,
        payload: query
    });
};

export const initializeEnvironment = store => {
    store.dispatch({
        type: INITIALIZE_ENVIRONMENT,
        payload: process.env.ENV
    });
};

const INITIAL_STATE = {
    environment: ''
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    console.log(state);
    switch (type) {
        case INITIAL_INFO:
            const { displayname, email, egroups, id } = payload;
            return { ...state, displayname, email, egroups, id };
        case INITIALIZE_ENVIRONMENT:
            return { ...state, environment: payload };
        default:
            return state;
    }
}
