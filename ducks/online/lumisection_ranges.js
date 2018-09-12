import axios from 'axios';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';

const FETCH_LUMISECTION_RANGES = 'FETCH_LUMISECTION_RANGES';

export const fetchLumisectionRanges = id_run =>
    error_handler(async dispatch => {
        const { data: lumisection_ranges } = await axios.get(
            `${api_url}/lumisections/id_run/${id_run}`
        );
        dispatch({
            type: FETCH_LUMISECTION_RANGES,
            payload: lumisection_ranges.reverse()
        });
    });

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_LUMISECTION_RANGES:
            return payload;
        default:
            return state;
    }
}
