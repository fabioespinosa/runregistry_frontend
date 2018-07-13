process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import axios from 'axios';

import { api_url } from '../../config/config';
const FETCH_INITIAL_RUNS = 'FETCH_INITIAL_RUNS';

export function fetchInitialOnlineRuns(store, query, isServer) {
    let url = api_url;
    if (isServer) {
        url = 'http://localhost:7003'
    }
    return axios
        .get(`${url}/runs`, {
            withCredentials: true,
            Cookie: query.cookie
        })
        .then(res => {
            store.dispatch({ type: FETCH_INITIAL_RUNS, payload: res.data });
        })
        .catch(err => {
            console.log(err.message);
            // store.dispatch({
            //     type: SHOW_NOTIFICATION,
            //     payload: {
            //         notification_title:
            //             'An error occurred fetching initial runs',
            //         notification_message: err.response,
            //         notification_type: 'danger'
            //     }
            // });
        });
}

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_INITIAL_RUNS:
            return payload;
        default:
            return state;
    }
}
