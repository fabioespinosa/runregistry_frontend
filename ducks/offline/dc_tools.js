import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';
import { FIND_AND_REPLACE_DATASETS } from './datasets';

export const syncComponents = (components_to_sync, dataset_ids) =>
    error_handler(async (dispatch, getState) => {
        const { data: datasets } = await axios.put(
            `${api_url}/dc_tools/sync_components`,
            { components_to_sync, dataset_ids },
            auth(getState)
        );
        dispatch({ type: FIND_AND_REPLACE_DATASETS, payload: datasets });
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
