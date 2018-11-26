import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';

export const syncWorkspaces = (synced_components, dataset_ids) =>
    error_handler(async (dispatch, getState) => {
        const { data } = await axios.put(
            `${api_url}/dc_tools/sync_components`,
            { ...synced_components, dataset_ids },
            auth(getState)
        );
    });

const INITIAL_STATE = {};
export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        default:
            return state;
    }
}
