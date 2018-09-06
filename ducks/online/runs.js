import axios from 'axios';

import { api_url } from '../../config/config';
import auth_configuration from '../../auth/auth';
const FETCH_INITIAL_RUNS = 'FETCH_INITIAL_RUNS';
const FETCH_SIGNIFICANT_RUNS = 'FETCH_SIGNIFICANT_RUNS';
const FETCH_ALL_RUNS = 'FETCH_ALL_RUNS';
const EDIT_RUN = 'EDIT_RUN';
const FILTER_RUNS = 'FILTER_RUNS';
const TABLE_LOADING = 'TABLE_LOADING';

export function fetchInitialOnlineRuns(store, query, isServer) {}

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

export const editRun = new_run => async dispatch => {
    const { data: run } = await axios.put(
        `${api_url}/runs/id_run/${new_run.run_number}`,
        new_run
    );
    dispatch({ type: EDIT_RUN, payload: run });
};

export const filterRuns = (page_size, page, sortings, filter) => async (
    dispatch,
    getState
) => {
    const run_endpoint = getState().online.ui.show_all_runs
        ? 'runs_filtered_ordered'
        : 'significant_runs_filtered_ordered';
    const { data: runs } = await axios.post(
        `${api_url}/${run_endpoint}/${page}`,
        { page_size, sortings, filter },
        auth_configuration(getState)
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
                pages: payload.pages,
                loading: false
            };
        case FETCH_ALL_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages,
                loading: false
            };
        case FETCH_SIGNIFICANT_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages,
                loading: false
            };
        case FILTER_RUNS:
            return {
                runs: payload.runs,
                pages: payload.pages,
                loading: false
            };
        case EDIT_RUN:
            return {
                ...state,
                runs: editRunHelper(state.runs, payload)
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

const findId = (array, id) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }
};

const editRunHelper = (runs, new_run) => {
    const index = findId(runs, new_run.id);
    return [...runs.slice(0, index), new_run, ...runs.slice(index + 1)];
};
