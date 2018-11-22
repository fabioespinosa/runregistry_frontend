import axios from 'axios';

import { api_url } from '../../config/config';
import auth from '../../auth/auth';
import { error_handler } from '../../utils/error_handlers';
import {
    toggleTableFilters,
    toggleShowAllRuns,
    hideManageRunModal
} from './ui';
const INITIALIZE_FILTERS = 'INITIALIZE_FILTERS-ONLINE';
const FETCH_INITIAL_RUNS = 'FETCH_INITIAL_RUNS';
const FETCH_SIGNIFICANT_RUNS = 'FETCH_SIGNIFICANT_RUNS';
const FETCH_ALL_RUNS = 'FETCH_ALL_RUNS';
const TABLE_LOADING = 'TABLE_LOADING';
const TABLE_LOADING_DONE = 'TABLE_LOADING_DONE';
const EDIT_RUN = 'EDIT_RUN';
const FILTER_RUNS = 'FILTER_RUNS';

export function fetchInitialOnlineRuns(store, query, isServer) {}

export const initializeFilters = (store, query) => {
    const { filters } = query;
    if (filters) {
        if (Object.keys(filters).length > 0) {
            store.dispatch({
                type: INITIALIZE_FILTERS,
                payload: Object.keys(filters).map(key => ({
                    id: key,
                    value: filters[key]
                })),
                filters,
                from_url: true
            });
            store.dispatch(toggleTableFilters());
        }
    }
    if (query.workspace === 'all') {
        store.dispatch(toggleShowAllRuns('show_all_runs'));
    }
    store.dispatch({ type: TABLE_LOADING });
    setTimeout(() => {
        store.dispatch({ type: TABLE_LOADING_DONE });
    }, 500);
};

// Change filters on the fly:
export const changeFilters = (filter_array, filters = {}) => ({
    type: INITIALIZE_FILTERS,
    payload: filter_array,
    from_url: false,
    filters
});

export const filterRuns = (page_size, page, sortings, filtered) =>
    error_handler(async (dispatch, getState) => {
        const run_endpoint = getState().online.ui.show_all_runs
            ? 'runs_filtered_ordered'
            : 'significant_runs_filtered_ordered';
        const { data: runs } = await axios.post(
            `${api_url}/${run_endpoint}/${page}`,
            { page_size, sortings, filter: filtered },
            auth(getState)
        );
        dispatch({
            type: FILTER_RUNS,
            payload: runs,
            filter: sortings.length > 0 || Object.keys(filtered).length > 0
        });
    });

export const editRun = (run_number, components) =>
    error_handler(async (dispatch, getState) => {
        const { data: run } = await axios.put(
            `${api_url}/runs/id_run/${run_number}`,
            components,
            auth(getState)
        );
        dispatch({ type: EDIT_RUN, payload: run });
        dispatch(hideManageRunModal());
    });

export const markSignificant = original_run =>
    error_handler(async (dispatch, getState) => {
        const { data: run } = await axios.post(
            `${api_url}/runs/mark_significant`,
            { original_run },
            auth(getState)
        );
        dispatch({ type: EDIT_RUN, payload: run });
    });

export const moveRun = (original_run, from_state, to_state) =>
    error_handler(async (dispatch, getState) => {
        const { data: run } = await axios.post(
            `${api_url}/runs/move_run/${from_state}/${to_state}`,
            { original_run, to_state },
            auth(getState)
        );
        dispatch({ type: EDIT_RUN, payload: run });
    });

const INITIAL_STATE = {
    runs: [],
    pageSize: 25,
    loading: false,
    filter: false,
    url_filter: [],
    filters: {}
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case INITIALIZE_FILTERS:
            return {
                ...state,
                filter: true,
                url_filter: payload,
                filters: action.filters
            };
        case TABLE_LOADING:
            return { ...state, loading: true };
        case TABLE_LOADING_DONE:
            return { ...state, loading: false };
        case FILTER_RUNS:
            return {
                ...state,
                runs: payload.runs,
                pages: payload.pages,
                loading: false,
                filter: action.filter
            };
        case EDIT_RUN:
            return {
                ...state,
                runs: editRunHelper(state.runs, payload)
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
