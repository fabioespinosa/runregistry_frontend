import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';

const FETCH_CYCLES = 'FETCH_CYCLES';
const SELECT_CYCLE = 'SELECT_CYCLE';

export const getCycles = () =>
    error_handler(async dispatch => {
        const { data: cycles } = await axios.get(`${api_url}/cycles`);
        dispatch({ type: FETCH_CYCLES, payload: cycles });
    });

export const createCycle = new_cycle =>
    error_handler(async (dispatch, getState) => {
        const { data: cycle } = await axios.post(
            `${api_url}/cycles`,
            new_cycle,
            auth(getState)
        );
        dispatch(getCycles());
    });

export const markCycleComplete = (id_cycle, workspace) =>
    error_handler(async (dispatch, getState) => {
        const { data: cycle } = await axios.put(
            `${api_url}/cycles/mark_cycle_complete/${workspace.toLowerCase()}`,
            { id_cycle },
            auth(getState)
        );
        dispatch(getCycles());
    });

export const selectCycle = selected_cycle => ({
    type: SELECT_CYCLE,
    payload: selected_cycle
});

const INITIAL_STATE = {
    selected_cycle: null,
    cycles: []
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_CYCLES:
            return { ...state, cycles: payload };
        case SELECT_CYCLE:
            return { ...state, selected_cycle: payload };
        default:
            return state;
    }
}
