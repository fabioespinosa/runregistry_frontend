import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';
import { FIND_AND_REPLACE_DATASETS, formatDatasets } from './datasets';

export const duplicateDatasets = ({
    target_dataset_name,
    source_dataset_name,
    workspaces
}) =>
    error_handler(async (dispatch, getState) => {
        const current_filter = getState().offline.editable_datasets.filter;

        const filter_with_source_dataset_name = {
            ...current_filter,
            name: { '=': source_dataset_name }
        };
        let { data: datasets } = await axios.post(
            `${api_url}/dc_tools/duplicate_datasets`,
            {
                target_dataset_name,
                source_dataset_name,
                workspaces_to_duplicate_into: workspaces,
                // The filter comes from the editable_datasets filter, which already guarantees we are dealing with a filter that does not include 'waiting dqm gui' datasets
                filter: filter_with_source_dataset_name
            },
            auth(getState, 'Dataset duplication in batch')
        );
        datasets = formatDatasets(datasets);
        dispatch({
            type: FIND_AND_REPLACE_DATASETS,
            payload: datasets
        });
    });

export const datasetUpdate = ({ source_dataset_name, new_state }) =>
    error_handler(async (dispatch, getState) => {
        const current_filter = getState().offline.editable_datasets.filter;
        const workspace = getState().offline.workspace.workspace.toLowerCase();
        const filter_with_source_dataset_name = {
            ...current_filter,
            name: { '=': source_dataset_name }
        };
        let { data: datasets } = await axios.post(
            `${api_url}/dc_tools/dataset_update`,
            {
                filter: filter_with_source_dataset_name,
                workspace_to_change_state_in: workspace,
                new_state
            },
            auth(getState, 'Change dataset state in batch')
        );
        datasets = formatDatasets(datasets);
        dispatch({
            type: FIND_AND_REPLACE_DATASETS,
            payload: datasets
        });
    });

const INITIAL_STATE = {};
export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        default:
            return state;
    }
}
