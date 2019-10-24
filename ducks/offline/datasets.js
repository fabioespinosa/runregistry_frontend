import axios from 'axios';
import { api_url, WAITING_DQM_GUI_CONSTANT } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import { hideManageDatasetModal } from './ui';
import auth from '../../auth/auth';

export const EDIT_DATASET = 'EDIT_DATASET';
export const FILTER_EDITABLE_DATASETS = 'FILTER_EDITABLE_DATASETS';
export const FILTER_WAITING_DATASETS = 'FILTER_WAITING_DATASETS';
export const FIND_AND_REPLACE_DATASETS = 'FIND_AND_REPLACE_DATASETS';
export const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS-OFFLINE';
export const CLEAR_DATASETS = 'CLEAR_DATASETS';

// endpoint can be either waiting_list or editable
export const filterEditableDatasets = (page_size, page, sortings, filter) =>
    error_handler(async (dispatch, getState) => {
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        // Online is the dataset we show in Online RR, we don't want to show it here:
        const name_filter = [{ '<>': 'online' }];
        // ONLY THOSE OPEN SIGNOFF OR COMPLETED ARE SHOWN IN EDITABLE
        const state_filter = [
            {
                or: [{ '=': 'OPEN' }, { '=': 'SIGNOFF' }, { '=': 'COMPLETED' }]
            }
        ];
        // If user was filtering on name (we also want to add that to the no-online name)
        if (filter.name) {
            name_filter.unshift(filter.name);
        }
        // If user was filtering by state, we also want to include that
        if (filter[`dataset_attributes.${workspace}_state`]) {
            state_filter.unshift(
                filter[`dataset_attributes.${workspace}_state`]
            );
            delete filter[`dataset_attributes.${workspace}_state`];
        }
        const filter_with_state_and_name = {
            ...filter,
            name: { and: name_filter },
            // For a dataset to be editable it must be either OPEN, SIGNOFF, or COMPLETED (ALL but waiting dqm gui)
            [`dataset_attributes.${workspace}_state`]: {
                and: state_filter
            }
        };
        const { data: datasets } = await axios.post(
            `${api_url}/datasets_filtered_ordered`,
            {
                workspace,
                page,
                page_size,
                sortings,
                filter: filter_with_state_and_name
            },
            auth(getState)
        );
        datasets.datasets = formatDatasets(datasets.datasets);
        dispatch({
            type: FILTER_EDITABLE_DATASETS,
            payload: datasets,
            // We include the filter because we will need it for DC tools:
            filter: filter_with_state_and_name
        });
    });

export const filterWaitingDatasets = (page_size, page, sortings, filter) =>
    error_handler(async (dispatch, getState) => {
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        const { data: datasets } = await axios.post(
            `${api_url}/datasets_filtered_ordered`,
            {
                workspace,
                page,
                page_size,
                sortings,
                filter: {
                    ...filter,
                    // Online is the dataset we show in Online RR, we don't want to show it here:
                    name: { '<>': 'online' },
                    // For a dataset to be considered waiting, its state must be 'waiting dqm gui'
                    [`dataset_attributes.${workspace}_state`]: WAITING_DQM_GUI_CONSTANT
                }
            },
            auth(getState)
        );
        datasets.datasets = formatDatasets(datasets.datasets);
        dispatch({
            type: FILTER_WAITING_DATASETS,
            payload: datasets
        });
    });

export const reGenerateCache = ({ run_number, dataset_name }) =>
    error_handler(async (dispatch, getState) => {
        let { data: dataset } = await axios.put(
            `${api_url}/recalculate_cache_for_specific_dataset`,
            {
                run_number,
                dataset_name
            }
        );
        dataset = formatDatasets([dataset])[0];
        dispatch({ type: EDIT_DATASET, payload: dataset });
    });

export const moveDataset = (
    { run_number, dataset_name },
    workspace,
    to_state
) =>
    error_handler(async (dispatch, getState) => {
        let { data: dataset } = await axios.post(
            `${api_url}/datasets/${workspace}/move_dataset`,
            {
                run_number,
                dataset_name,
                workspace,
                to_state
            },
            auth(getState)
        );
        dataset = formatDatasets([dataset])[0];
        dispatch({ type: EDIT_DATASET, payload: dataset });
        // TODO: remove dataset from top table, add it to below table in different color
    });

export const editDataset = (
    { run_number, dataset_name },
    workspace,
    components
) =>
    error_handler(async (dispatch, getState) => {
        let { data: dataset } = await axios.put(
            `${api_url}/datasets/${workspace}`,
            { ...components, run_number, dataset_name },
            auth(getState)
        );
        dataset = formatDatasets([dataset])[0];
        dispatch({ type: EDIT_DATASET, payload: dataset });
        dispatch(hideManageDatasetModal());
    });

export const reFetchDataset = (run_number, dataset_name) =>
    error_handler(async dispatch => {
        let { data: dataset } = await axios.post(
            `${api_url}/datasets/get_dataset`,
            {
                run_number,
                dataset_name
            }
        );
        dataset = formatDatasets([dataset])[0];
        dispatch({
            type: EDIT_DATASET,
            payload: dataset
        });
    });

export const clearDatasets = () => ({
    type: CLEAR_DATASETS
});

export const formatDatasets = datasets => {
    return datasets.map(dataset => ({
        ...dataset.dataset_attributes,
        ...dataset,
        Run: dataset.Run.rr_attributes,
        triplet_summary: dataset.DatasetTripletCache
            ? dataset.DatasetTripletCache.triplet_summary
            : {}
    }));
};

// Reducer of both (editable and waiting datasets) is in waiting_datasets.js and editable_datasets.js
