import axios from 'axios';

import { api_url } from '../../config/config';
const FETCH_INITIAL_DATASETS = 'FETCH_INITIAL_DATASETS';
const FETCH_SIGNIFICANT_DATASETS = 'FETCH_SIGNIFICANT_DATASETS';
const FETCH_ALL_DATASETS = 'FETCH_ALL_DATASETS';
const EDIT_DATASET = 'EDIT_DATASET';
const FILTER_DATASETS = 'FILTER_DATASETS';
const TABLE_LOADING = 'TABLE_LOADING';

export function fetchInitialOfflineDatasets(store, query, isServer) {}

export const fetchSignificantDatasets = () => async dispatch => {
    dispatch({ type: TABLE_LOADING });
    const { data: datasets } = await axios.get(
        `${api_url}/significant_datasets_paginated/1`
    );
    dispatch({ type: FETCH_SIGNIFICANT_DATASETS, payload: datasets });
};

export const fetchAllDatasets = () => async dispatch => {
    dispatch({ type: TABLE_LOADING });
    const { data: datasets } = await axios.get(
        `${api_url}/datasets_paginated/1`
    );
    dispatch({ type: FETCH_ALL_DATASETS, payload: datasets });
};

export const editDataset = new_dataset => async dispatch => {
    const { data: dataset } = await axios.put(
        `${api_url}/datasets/id_dataset/${new_dataset.dataset_number}`,
        new_dataset
    );
    dispatch({ type: EDIT_DATASET, payload: dataset });
};

export const filterDatasets = (page_size, page, sorted, filtered) => async (
    dispatch,
    getState
) => {
    const dataset_endpoint = getState().offline.ui.show_waiting_list
        ? 'signoff_runs_filtered_ordered'
        : 'datasets_filtered_ordered';
    const query_object = { page_size, filter: {} };
    filtered.forEach(criteria => {
        query_object.filter[criteria.id] = criteria.value;
    });
    const { data: datasets } = await axios.post(
        `${api_url}/${dataset_endpoint}/${page}`,
        query_object
    );
    dispatch({ type: FILTER_DATASETS, payload: datasets });
};

const INITIAL_STATE = {
    datasets: [],
    pageSize: 25,
    loading: false
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_INITIAL_DATASETS:
            return {
                datasets: payload.datasets,
                pages: payload.pages
            };
        case FETCH_ALL_DATASETS:
            return {
                datasets: payload.datasets,
                pages: payload.pages
            };
        case FETCH_SIGNIFICANT_DATASETS:
            return {
                datasets: payload.datasets,
                pages: payload.pages
            };
        case FILTER_DATASETS:
            return {
                datasets: payload.datasets,
                pages: payload.pages
            };
        case EDIT_DATASET:
            return {
                ...state,
                datasets: editDatasetHelper(state.datasets, payload)
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

const editDatasetHelper = (datasets, new_dataset) => {
    const index = findId(datasets, new_dataset.id);
    return [
        ...datasets.slice(0, index),
        new_dataset,
        ...datasets.slice(index + 1)
    ];
};
