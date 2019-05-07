import axios from 'axios';
import auth from '../../auth/auth';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';

const FETCH_LUMISECTION_RANGES = 'FETCH_LUMISECTION_RANGES';
const EDIT_LUMISECTIONS = 'EDIT_LUMISECTIONS';

export const fetchJointLumisectionRanges = (run_number, dataset_name) =>
    error_handler(async dispatch => {
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/joint_lumisection_ranges`,
            { run_number, dataset_name }
        );
        dispatch({
            type: FETCH_LUMISECTION_RANGES,
            payload: lumisections.reverse()
        });
    });

export const fetchOMSLumisectionRanges = run_number =>
    error_handler(async dispatch => {
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/oms_lumisection_ranges`,
            // OMS is always online:
            { run_number, dataset_name: 'online' }
        );
        dispatch({
            type: FETCH_LUMISECTION_RANGES,
            payload: lumisections.reverse()
        });
    });

export const fetchRRLumisectionRanges = (run_number, dataset_name) =>
    error_handler(async dispatch => {
        console.log('here');
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/rr_lumisection_ranges`,
            { run_number, dataset_name }
        );
        dispatch({
            type: FETCH_LUMISECTION_RANGES,
            payload: lumisections.reverse()
        });
    });

export const addLumisectionRange = (
    new_lumisection_range,
    run_number,
    dataset_name,
    component
) =>
    error_handler(async (dispatch, getState) => {
        const { data: lumisections } = await axios.put(
            `${api_url}/lumisections/edit_lumisections`,
            { new_lumisection_range, run_number, dataset_name, component },
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
