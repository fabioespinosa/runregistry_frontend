import { fetchSignificantRuns, fetchAllRuns } from './runs';
const TOGGLE_SHOW_ALL_RUNS = 'TOGGLE_SHOW_ALL_RUNS';
const SHOW_CONFIGURATION_MODAL = 'SHOW_CONFIGURATION_MODAL';
export const HIDE_CONFIGURATION_MODAL = 'HIDE_CONFIGURATION_MODAL';
const SHOW_MANAGE_RUN_MODAL = 'SHOW_MANAGE_RUN_MODAL';
const HIDE_MANAGE_RUN_MODAL = 'HIDE_MANAGE_RUN_MODAL';
const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS';

export const toggleShowAllRuns = new_value => dispatch => {
    if (new_value === 'show_significant_runs') {
        dispatch(fetchSignificantRuns());
    }
    if (new_value === 'show_all_runs') {
        dispatch(fetchAllRuns());
    }
    dispatch({
        type: TOGGLE_SHOW_ALL_RUNS,
        payload: new_value === 'show_all_runs'
    });
};

export const showConfigurationModal = configuration_modal_type => ({
    type: SHOW_CONFIGURATION_MODAL,
    payload: configuration_modal_type
});

export const hideConfigurationModal = () => ({
    type: HIDE_CONFIGURATION_MODAL
});

export const showManageRunModal = run => ({
    type: SHOW_MANAGE_RUN_MODAL,
    payload: run
});

export const hideManageRunModal = () => ({
    type: HIDE_MANAGE_RUN_MODAL
});

export const toggleTableFilters = () => ({ type: TOGGLE_TABLE_FILTERS });

const INITIAL_STATE = {
    show_all_runs: true,
    configuration_modal_visible: false,
    configuration_modal_type: '',
    manage_run_modal_visible: false,
    manage_run_modal_run: {},
    table: {
        filterable: false
    }
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case TOGGLE_SHOW_ALL_RUNS:
            return {
                ...state,
                show_all_runs: !state.show_all_runs
            };
        case SHOW_CONFIGURATION_MODAL:
            return {
                ...state,
                configuration_modal_visible: true,
                configuration_modal_type: payload
            };
        case HIDE_CONFIGURATION_MODAL:
            return {
                ...state,
                configuration_modal_visible: false,
                configuration_modal_type: ''
            };
        case SHOW_MANAGE_RUN_MODAL:
            return {
                ...state,
                manage_run_modal_visible: true,
                manage_run_modal_run: payload
            };
        case HIDE_MANAGE_RUN_MODAL:
            return {
                ...state,
                manage_run_modal_visible: false
            };
        case TOGGLE_TABLE_FILTERS:
            return {
                ...state,
                table: {
                    ...state.table,
                    filterable: !state.table.filterable
                }
            };
        default:
            return state;
    }
}
