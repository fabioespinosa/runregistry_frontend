process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import axios from 'axios';

import { api_url } from '../../config/config';
const FETCH_INITIAL_RUNS = 'FETCH_INITIAL_RUNS';
const FETCH_SIGNIFICANT_RUNS = 'FETCH_SIGNIFICANT_RUNS';
const FETCH_ALL_RUNS = 'FETCH_ALL_RUNS';
const FILTER_RUNS = 'FILTER_RUNS';
const TABLE_LOADING = 'TABLE_LOADING';

export function fetchInitialOnlineRuns(store, query, isServer) {
    const url = isServer ? 'http://localhost:7003' : api_url;

    // return axios
    //     .get(`${url}/runs_paginated/1`, {
    //         withCredentials: true,
    //         Cookie: query.cookie
    //     })
    //     .then(res => {
    //         store.dispatch({ type: FETCH_INITIAL_RUNS, payload: res.data });
    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //         // store.dispatch({
    //         //     type: SHOW_NOTIFICATION,
    //         //     payload: {
    //         //         notification_title:
    //         //             'An error occurred fetching initial runs',
    //         //         notification_message: err.response,
    //         //         notification_type: 'danger'
    //         //     }
    //         // });
    //     });
}

export const fetchSignificantRuns = () => async dispatch => {
    dispatch({ type: TABLE_LOADING });
    const { data: runs } = await axios.get(
        `${api_url}/significant_runs_paginated/1`
    );
    dispatch({ type: FETCH_SIGNIFICANT_RUNS, payload: runs });
};

export const fetchAllRuns = () => async dispatch => {
    dispatch({ type: TABLE_LOADING });
    const { data: runs } = await axios.get(`${api_url}/runs_paginated/1`);
    dispatch({ type: FETCH_ALL_RUNS, payload: runs });
};

export const filterRuns = (
    page_size,
    page,
    sorted,
    filtered
) => async dispatch => {
    const query_object = { page_size, filter: {} };
    filtered.forEach(criteria => {
        query_object.filter[criteria.id] = criteria.value;
    });
    const { data: runs } = await axios.post(
        `${api_url}/runs_filtered_ordered/${page}`,
        query_object
    );
    dispatch({ type: FILTER_RUNS, payload: runs });
};

const INITIAL_STATE = {
    runs: [],
    pageSize: 25,
    loading: false
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_INITIAL_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages
            };
        case FETCH_ALL_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages
            };
        case FETCH_SIGNIFICANT_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages
            };
        case FILTER_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages
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
