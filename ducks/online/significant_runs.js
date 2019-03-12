import axios from 'axios';

import { api_url } from '../../config/config';
import auth from '../../auth/auth';
import { error_handler } from '../../utils/error_handlers';
import { hideManageRunModal } from './ui';
const INITIALIZE_FILTERS = 'INITIALIZE_FILTERS-ONLINE';
const EDIT_RUN = 'EDIT_RUN';
const FILTER_RUNS = 'FILTER_SIGNIFICANT_RUNS';

export const filterRuns = (page_size, page, sortings, filtered) =>
    error_handler(async (dispatch, getState) => {
        const { data: runs } = await axios.post(
            `${api_url}/significant_runs_filtered_ordered/${page}`,
            { page_size, sortings, filter: filtered },
            auth(getState)
        );
        runs.runs = formatRuns(runs.runs);
        dispatch({
            type: FILTER_RUNS,
            payload: runs,
            filter: sortings.length > 0 || Object.keys(filtered).length > 0
        });
    });

export const editRun = (run_number, components) =>
    error_handler(async (dispatch, getState) => {
        let { data: run } = await axios.put(
            `${api_url}/runs/id_run/${run_number}`,
            components,
            auth(getState)
        );
        run = formatRuns([run])[0];
        dispatch({ type: EDIT_RUN, payload: run });
        dispatch(hideManageRunModal());
    });

export const markSignificant = original_run =>
    error_handler(async (dispatch, getState) => {
        let { data: run } = await axios.post(
            `${api_url}/runs/mark_significant`,
            { original_run },
            auth(getState)
        );
        run = formatRuns([run])[0];
        dispatch({ type: EDIT_RUN, payload: run });
    });

export const moveRun = (original_run, from_state, to_state) =>
    error_handler(async (dispatch, getState) => {
        let { data: run } = await axios.post(
            `${api_url}/runs/move_run/${from_state}/${to_state}`,
            { original_run, to_state },
            auth(getState)
        );
        run = formatRuns([run])[0];
        dispatch({ type: EDIT_RUN, payload: run });
    });

export const refreshRun = id_run =>
    error_handler(async (dispatch, getState) => {
        const { data: run } = await axios.post(
            `${api_url}/runs/refresh_run/${id_run}`,
            {},
            auth(getState)
        );
        dispatch({ type: EDIT_RUN, payload: run });
        return run;
    });

const INITIAL_STATE = {
    runs: [],
    filter: false,
    filter_array: [],
    filter_object: {}
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case INITIALIZE_FILTERS:
            return {
                ...state,
                filter: true,
                filter_array: payload,
                filter_object: action.filters
            };
        case FILTER_RUNS:
            return {
                ...state,
                runs: payload.runs,
                pages: payload.pages,
                filter: action.filter
            };
        case EDIT_RUN:
            return { ...state, runs: editRunHelper(state.runs, payload) };
        default:
            return state;
    }
}

const findId = (array, run_number) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].run_number === run_number) {
            return i;
        }
    }
};

const editRunHelper = (runs, new_run) => {
    const index = findId(runs, new_run.run_number);
    return [...runs.slice(0, index), new_run, ...runs.slice(index + 1)];
};

const formatRuns = runs => {
    return runs.map(run => ({
        ...run.oms_attributes,
        ...run.rr_attributes,
        ...run,
        triplet_summary: run.DatasetTripletCache
            ? run.DatasetTripletCache.triplet_summary
            : {}
    }));
};
