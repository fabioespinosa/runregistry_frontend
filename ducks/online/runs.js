process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import axios from 'axios';

import { api_url } from '../../config/config';
const FETCH_INITIAL_RUNS = 'FETCH_INITIAL_RUNS';
const FETCH_SIGNIFICANT_RUNS = 'FETCH_SIGNIFICANT_RUNS';
const FETCH_ALL_RUNS = 'FETCH_ALL_RUNS';
const TABLE_LOADING = 'TABLE_LOADING';

export function fetchInitialOnlineRuns(store, query, isServer) {
    let url = api_url;
    if (isServer) {
        url = 'http://localhost:7003';
    }
    return axios
        .get(`${url}/runs`, {
            withCredentials: true,
            Cookie: query.cookie
        })
        .then(res => {
            store.dispatch({
                type: FETCH_INITIAL_RUNS,
                payload: res.data
            });
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

export const fetchSignificantRuns = () => async dispatch => {
    dispatch({ type: TABLE_LOADING });
    const { data: runs } = await axios.get(`${api_url}/significant_runs`);
    dispatch({ type: FETCH_SIGNIFICANT_RUNS, payload: runs });
};

export const fetchAllRuns = () => async dispatch => {
    dispatch({ type: TABLE_LOADING });
    const { data: runs } = await axios.get(`${api_url}/runs`);
    dispatch({ type: FETCH_ALL_RUNS, payload: runs });
};

export const filterData = () => {};

const INITIAL_STATE = {
    runs: [],
    pageSize: 20,
    loading: false
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_INITIAL_RUNS:
            return {
                runs: payload,
                pages: Math.ceil(payload / state.pageSize)
            };
        case FETCH_ALL_RUNS:
            return {
                runs: payload,
                pages: Math.ceil(payload / state.pageSize)
            };
        case FETCH_SIGNIFICANT_RUNS:
            return {
                runs: payload,
                pages: Math.ceil(payload / state.pageSize)
            };
        case TABLE_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
