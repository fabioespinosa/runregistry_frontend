import axios from 'axios';

import { api_url } from '../../config/config';
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

export const filterRuns = (page_size, page, sorted, filtered) => async (
    dispatch,
    getState
) => {
    const run_endpoint = getState().online.ui.show_all_runs
        ? 'runs_filtered_ordered'
        : 'significant_runs_filtered_ordered';
    const query_object = { page_size, filter: {} };
    // If querying a triplet, change it so that JSONB filtering works in back end:
    filtered = filtered.map(filter => {
        const new_filter = { ...filter };
        if (filter.id.includes('_triplet')) {
            new_filter.id = `${filter.id}.status`;
            new_filter.value = filter.value.toUpperCase();
        }
        return new_filter;
    });
    console.log(filtered);
    filtered.forEach(({ id, value }) => {
        const criteria = value.split(' ').filter(arg => arg !== '');
        let query = {};
        if (criteria.length === 1) {
            // If user types '=' or '<' like operator not perform like:
            console.log(criteria[0][0]);
            if (['=', '<', '>', '<=', '>='].includes(criteria[0][0])) {
                const operator = criteria[0][0];
                criteria[0] = criteria[0].substring(1);
                criteria.unshift(operator);
            } else {
                criteria[0] = `%${criteria[0]}%`;
                criteria.unshift('like');
            }
        }
        if (criteria.length === 2) {
            query = { [criteria[0]]: criteria[1] };
        }
        if (criteria.length === 5) {
            query = {
                [criteria[2]]: {
                    [criteria[0]]: criteria[1],
                    [criteria[3]]: criteria[4]
                }
            };
        }
        if (criteria.length === 7) {
            query = {
                [criteria[2]]: {}
            };
        }
        console.log(query);
        query_object.filter[id] = query;
    });
    const { data: runs } = await axios.post(
        `${api_url}/${run_endpoint}/${page}`,
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
