import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import { hideManageDatasetModal } from './ui';
import auth from '../../auth/auth';

export const EDIT_DATASET = 'EDIT_DATASET';
export const FILTER_EDITABLE_DATASETS = 'FILTER_EDITABLE_DATASETS';
export const FILTER_WAITING_DATASETS = 'FILTER_WAITING_DATASETS';
export const FIND_AND_REPLACE_DATASETS = 'FIND_AND_REPLACE_DATASETS';
export const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS-OFFLINE';

// endpoint can be either waiting_list or editable
export const filterEditableDatasets = (page_size, page, sortings, filter) =>
    error_handler(async (dispatch, getState) => {
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        const { data: datasets } = await axios.post(
            `${api_url}/datasets/${workspace}/editable/${page}/`,
            { page_size, sortings, filter },
            auth(getState)
        );
        datasets.datasets = formatDatasets(datasets.datasets);
        dispatch({
            type: FILTER_EDITABLE_DATASETS,
            payload: datasets,
            // We include the filter because we will need it for DC tools:
            filter
        });
    });

export const filterWaitingDatasets = (page_size, page, sortings, filter) =>
    error_handler(async (dispatch, getState) => {
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        const { data: datasets } = await axios.post(
            `${api_url}/datasets/${workspace}/waiting_list/${page}/`,
            { page_size, sortings, filter },
            auth(getState)
        );
        datasets.datasets = formatDatasets(datasets.datasets);
        dispatch({
            type: FILTER_WAITING_DATASETS,
            payload: datasets
        });
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
            type: FIND_AND_REPLACE_DATASETS,
            payload: [dataset]
        });
    });

const formatDatasets = datasets => {
    return datasets.map(dataset => ({
        ...dataset.dataset_attributes,
        ...dataset,
        Run: dataset.Run.rr_attributes,
        triplet_summary: dataset.DatasetTripletCache.triplet_summary
    }));
};

// Reducer of both (editable and waiting datasets) is in waiting_datasets.js and editable_datasets.js
