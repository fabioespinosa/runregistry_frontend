import { filterRuns, filterSignificantRuns } from './runs';
const TOGGLE_SHOW_ALL_RUNS = 'TOGGLE_SHOW_ALL_RUNS-ONLINE';
const SHOW_CONFIGURATION_MODAL = 'SHOW_CONFIGURATION_MODAL-ONLINE';
export const HIDE_CONFIGURATION_MODAL = 'HIDE_CONFIGURATION_MODAL-ONLINE';
const SHOW_MANAGE_RUN_MODAL = 'SHOW_MANAGE_RUN_MODAL-ONLINE';
const HIDE_MANAGE_RUN_MODAL = 'HIDE_MANAGE_RUN_MODAL-ONLINE';
const SHOW_LUMISECTION_MODAL = 'SHOW_LUMISECTION_MODAL-ONLINE';
const HIDE_LUMISECTION_MODAL = 'HIDE_LUMISECTION_MODAL-ONLINE';
const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS-ONLINE';
const SHOW_CLASSIFIER_VISUALIZATION_MODAL =
    'SHOW_CLASSIFIER_VISUALIZATION_MODAL-ONLINE';
const HIDE_CLASSIFIER_VISUALIZATION_MODAL =
    'HIDE_CLASSIFIER_VISUALIZATION_MODAL-ONLINE';

export const toggleShowAllRunsAndFetch = new_value => dispatch => {
    dispatch({
        type: TOGGLE_SHOW_ALL_RUNS,
        payload: new_value === 'show_all_runs'
    });
    dispatch(filterRuns(25, 0, [], []));
};

export const toggleShowAllRuns = new_value => ({
    type: TOGGLE_SHOW_ALL_RUNS,
    payload: new_value === 'show_all_runs'
});

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

export const showLumisectionModal = run => ({
    type: SHOW_LUMISECTION_MODAL,
    payload: run
});

export const hideLumisectionModal = () => ({ type: HIDE_LUMISECTION_MODAL });

export const showClassifierVisualizationModal = run => ({
    type: SHOW_CLASSIFIER_VISUALIZATION_MODAL,
    payload: run
});

export const hideClassifierVisualizationModal = () => ({
    type: HIDE_CLASSIFIER_VISUALIZATION_MODAL
});

export const toggleTableFilters = () => ({ type: TOGGLE_TABLE_FILTERS });

const INITIAL_STATE = {
    show_all_runs: false,
    configuration_modal_visible: false,
    configuration_modal_type: '',
    manage_run_modal_visible: false,
    manage_run_modal_run: {},
    lumisection_modal_visible: false,
    lumisection_modal_run: {},
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
                show_all_runs: payload
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
        case SHOW_LUMISECTION_MODAL:
            return {
                ...state,
                lumisection_modal_visible: true,
                lumisection_modal_run: payload
            };
        case HIDE_LUMISECTION_MODAL:
            return { ...state, lumisection_modal_visible: false };
        case SHOW_CLASSIFIER_VISUALIZATION_MODAL:
            return {
                ...state,
                classifier_visualization_modal: true,
                classifier_visualization_modal_run: payload
            };
        case HIDE_CLASSIFIER_VISUALIZATION_MODAL:
            return {
                ...state,
                classifier_visualization_modal: false
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
