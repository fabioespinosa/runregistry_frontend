import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';

const FETCH_LUMISECTION_RANGES = 'FETCH_LUMISECTION_RANGES-OFFLINE';

const EDIT_LUMISECTIONS = 'EDIT_LUMISECTIONS';

export const fetchLumisectionRanges = id_dataset =>
    error_handler(async (dispatch, getState) => {
        const { data: lumisections } = await axios.post(
            `${api_url}/dataset_lumisections`,
            { id_dataset }
        );
        dispatch({ type: FETCH_LUMISECTION_RANGES, payload: lumisections });
    });

export const editLumisections = edited_lumisections =>
    error_handler(async (dispatch, getState) => {
        const { data: lumisections } = await axios.put(
            `${api_url}/dataset_lumisections`,
            edited_lumisections,
            auth(getState)
        );
        dispatch({
            type: EDIT_LUMISECTIONS,
            payload: lumisections
        });
    });

const INITIAL_STATE = [];
export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_LUMISECTION_RANGES:
            return payload;
        case EDIT_LUMISECTIONS:
            return payload;
        default:
            return state;
    }
}
