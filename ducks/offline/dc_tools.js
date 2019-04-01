import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';
import { FIND_AND_REPLACE_DATASETS } from './datasets';

export const duplicateDatasets = ({
    target_dataset_name,
    source_dataset_name,
    workspaces
}) =>
    error_handler(async (dispatch, getState) => {
        const current_filter = getState().offline.editable_datasets.filter;
        const { data: datasets } = await axios.post(
            `${api_url}/dc_tools/duplicate_datasets`,
            {
                filter: current_filter,
                target_dataset_name,
                source_dataset_name,
                workspaces_to_duplicate_into: workspaces
            },
            auth(getState)
        );
        dispatch({
            type: FIND_AND_REPLACE_DATASETS,
            payload: datasets
        });
    });

export const syncLumisections = (lumisection_attributes_to_sync, dataset_ids) =>
    error_handler(async (dispatch, getState) => {
        const { data: datasets } = await axios.put(
            `${api_url}/dc_tools/sync_lumisections`,
            { lumisection_attributes_to_sync, dataset_ids },
            auth(getState)
        );
        dispatch({ type: FIND_AND_REPLACE_DATASETS, payload: datasets });
    });
const INITIAL_STATE = {};
export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        default:
            return state;
    }
}
