import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import { hideManageDatasetModal } from './ui';
import auth from '../../auth/auth';
const INITIALIZE_FILTERS = 'INITIALIZE_FILTERS-OFFLINE';
const FETCH_INITIAL_DATASETS = 'FETCH_INITIAL_DATASETS';
const FETCH_SIGNIFICANT_DATASETS = 'FETCH_SIGNIFICANT_DATASETS';
const FETCH_ALL_DATASETS = 'FETCH_ALL_DATASETS';
const EDIT_DATASET = 'EDIT_DATASET';
const FILTER_DATASETS = 'FILTER_DATASETS';
const TABLE_LOADING = 'TABLE_LOADING-OFFLINE';
const TABLE_LOADING_DONE = 'TABLE_LOADING_DONE-OFFLINE';

export function fetchInitialOfflineDatasets(store, query, isServer) {}

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
        }
    }
    // TODO change workspace
    store.dispatch({ type: TABLE_LOADING });
    setTimeout(() => {
        store.dispatch({ type: TABLE_LOADING_DONE });
    }, 500);
};

export const changeFilters = (filter_array, filters = {}) => ({
    type: INITIALIZE_FILTERS,
    payload: filter_array,
    from_url: false,
    filters
});

export const filterDatasets = (page_size, page, sortings, filtered) =>
    error_handler(async (dispatch, getState) => {
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        const dataset_endpoint = getState().offline.ui.show_waiting_list
            ? 'waiting_list'
            : 'editable';
        const { data: datasets } = await axios.post(
            `${api_url}/datasets/${workspace}/${dataset_endpoint}/${page}/`,
            { page_size, sortings, filter: filtered },
            auth(getState)
        );
        dispatch({
            type: FILTER_DATASETS,
            payload: datasets,
            filter: sortings.length > 0 || Object.keys(filtered).length > 0
        });
    });

// export const fetchSignificantDatasets = () =>
//     error_handler(async dispatch => {
//         dispatch({ type: TABLE_LOADING });
//         const { data: datasets } = await axios.get(
//             `${api_url}/significant_datasets_paginated/1`
//         );
//         dispatch({ type: FETCH_SIGNIFICANT_DATASETS, payload: datasets });
//     });

// export const fetchAllDatasets = () =>
//     error_handler(async dispatch => {
//         dispatch({ type: TABLE_LOADING });
//         const { data: datasets } = await axios.get(
//             `${api_url}/datasets_paginated/1`
//         );
//         dispatch({ type: FETCH_ALL_DATASETS, payload: datasets });
//     });

export const moveDataset = (id_dataset, workspace, state) =>
    error_handler(async (dispatch, getState) => {
        const { data: dataset } = await axios.post(
            `${api_url}/datasets/move_dataset`,
            {
                id_dataset,
                workspace,
                state
            },
            auth(getState)
        );
        dispatch({ type: EDIT_DATASET, payload: dataset });
    });

export const editDataset = (id_dataset, components) =>
    error_handler(async (dispatch, getState) => {
        const { data: dataset } = await axios.put(
            `${api_url}/datasets`,
            { ...components, id_dataset },
            auth(getState)
        );
        dispatch({ type: EDIT_DATASET, payload: dataset });
        dispatch(hideManageDatasetModal());
    });

const INITIAL_STATE = {
    datasets: [],
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
        case FILTER_DATASETS:
            return {
                ...state,
                datasets: payload.datasets,
                pages: payload.pages,
                loading: false,
                filter: action.filter
            };
        case EDIT_DATASET:
            return {
                ...state,
                datasets: editDatasetHelper(state.datasets, payload)
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

const editDatasetHelper = (datasets, new_dataset) => {
    const index = findId(datasets, new_dataset.id);
    return [
        ...datasets.slice(0, index),
        new_dataset,
        ...datasets.slice(index + 1)
    ];
};
