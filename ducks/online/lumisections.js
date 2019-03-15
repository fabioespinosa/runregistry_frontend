import axios from 'axios';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';

const FETCH_LUMISECTION_RANGES = 'FETCH_LUMISECTION_RANGES';

export const fetchJointLumisectionRanges = (run_number, dataset_name) =>
    error_handler(async dispatch => {
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/joint_lumisections`,
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
            `${api_url}/lumisections/oms_lumisections`,
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
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/rr_lumisections`,
            { run_number, dataset_name }
        );
        dispatch({
            type: FETCH_LUMISECTION_RANGES,
            payload: lumisections.reverse()
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
