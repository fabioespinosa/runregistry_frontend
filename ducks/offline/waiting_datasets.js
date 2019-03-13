import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import { hideManageDatasetModal } from './ui';
import auth from '../../auth/auth';

const EDIT_DATASET = 'EDIT_DATASET';
const FILTER_DATASETS = 'FILTER_DATASETS-WAITING';
const TABLE_LOADING = 'TABLE_LOADING-OFFLINE';
const TABLE_LOADING_DONE = 'TABLE_LOADING_DONE-OFFLINE';
export const FIND_AND_REPLACE_DATASETS = 'FIND_AND_REPLACE_DATASETS';
const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS-OFFLINE';

export function fetchInitialOfflineDatasets(store, query, isServer) {}

// endpoint can be either waiting_list or editable
export const filterDatasets = (page_size, page, sortings, filtered) =>
    error_handler(async (dispatch, getState) => {
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        const { data: datasets } = await axios.post(
            `${api_url}/datasets/${workspace}/waiting_list/${page}/`,
            { page_size, sortings, filter: filtered },
            auth(getState)
        );
        datasets.datasets = formatDatasets(datasets.datasets);
        dispatch({
            type: FILTER_DATASETS,
            payload: datasets
        });
    });

export const moveDataset = (id_dataset, workspace, state) =>
    error_handler(async (dispatch, getState) => {
        const { data: dataset } = await axios.post(
            `${api_url}/datasets/${workspace}/move_dataset`,
            {
                id_dataset,
                workspace,
                state
            },
            auth(getState)
        );
        dispatch({ type: EDIT_DATASET, payload: dataset });
    });

export const editDataset = (id_dataset, workspace, components) =>
    error_handler(async (dispatch, getState) => {
        const { data: dataset } = await axios.put(
            `${api_url}/datasets/${workspace}`,
            { ...components, id_dataset },
            auth(getState)
        );
        dispatch({ type: EDIT_DATASET, payload: dataset });
        dispatch(hideManageDatasetModal());
    });

const INITIAL_STATE = {
    datasets: []
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FILTER_DATASETS:
            return {
                ...state,
                datasets: payload.datasets,
                pages: payload.pages
            };
        case EDIT_DATASET:
            return {
                ...state,
                datasets: editDatasetHelper(state.datasets, payload)
            };
        case FIND_AND_REPLACE_DATASETS:
            return {
                ...state,
                datasets: findAndReplaceHelper(state.datasets, payload)
            };
        case TOGGLE_TABLE_FILTERS:
            return { ...state, filterable: !state.filterable };
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

const findAndReplaceHelper = (datasets, new_datasets) => {
    new_datasets.forEach(new_dataset => {
        datasets = editDatasetHelper(datasets, new_dataset);
    });
    return datasets;
};

const formatDatasets = datasets => {
    return datasets.map(dataset => ({
        ...dataset.dataset_attributes,
        ...dataset,
        Run: dataset.Run.rr_attributes,
        triplet_summary: dataset.DatasetTripletCache.triplet_summary
    }));
};
