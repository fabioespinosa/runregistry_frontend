import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';

const FETCH_CYCLES = 'FETCH_CYCLES';

export const getCycles = () =>
    error_handler(async dispatch => {
        const { data: cycles } = await axios.get(`${api_url}/cycles`);
        dispatch({ type: FETCH_CYCLES, payload: cycles });
    });

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_CYCLES:
            return payload;
        default:
            return state;
    }
}
