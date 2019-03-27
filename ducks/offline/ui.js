import { filterDatasets } from './datasets';
const TOGGLE_SHOW_WAITING_LIST = 'TOGGLE_SHOW_WAITING_LIST-OFFLINE';
const TOGGLE_SHOW_ALL_RUNS = 'TOGGLE_SHOW_ALL_RUNS-OFFLINE';
const SHOW_CONFIGURATION_MODAL = 'SHOW_CONFIGURATION_MODAL-OFFLINE';
export const HIDE_CONFIGURATION_MODAL = 'HIDE_CONFIGURATION_MODAL-OFFLINE';
const SHOW_MANAGE_DATASET_MODAL = 'SHOW_MANAGE_DATASET_MODAL-OFFLINE';
const HIDE_MANAGE_DATASET_MODAL = 'HIDE_MANAGE_DATASET_MODAL-OFFLINE';
const SHOW_LUMISECTION_MODAL = 'SHOW_LUMISECTION_MODAL-OFFLINE';
const HIDE_LUMISECTION_MODAL = 'HIDE_LUMISECTION_MODAL-OFFLINE';
const SHOW_CREATE_CYCLE_MODAL = 'SHOW_CREATE_CYCLE_MODAL-OFFLINE';
const HIDE_CREATE_CYCLE_MODAL = 'HIDE_CREATE_CYCLE_MODAL-OFFLINE';

export const toggleWaitingList = new_value => dispatch => {
    dispatch({
        type: TOGGLE_SHOW_WAITING_LIST,
        payload: new_value === 'show_waiting_list'
    });
    dispatch(filterDatasets(25, 0, [], []));
};

export const showConfigurationModal = configuration_modal_type => ({
    type: SHOW_CONFIGURATION_MODAL,
    payload: configuration_modal_type
});

export const hideConfigurationModal = () => ({
    type: HIDE_CONFIGURATION_MODAL
});

export const showManageDatasetModal = dataset => ({
    type: SHOW_MANAGE_DATASET_MODAL,
    payload: dataset
});

export const hideManageDatasetModal = () => ({
    type: HIDE_MANAGE_DATASET_MODAL
});

export const showLumisectionModal = dataset => ({
    type: SHOW_LUMISECTION_MODAL,
    payload: dataset
});

export const showCreateCycleModal = () => ({
    type: SHOW_CREATE_CYCLE_MODAL
});

export const hideCreateCycleModal = () => ({
    type: HIDE_CREATE_CYCLE_MODAL
});

export const hideLumisectionModal = () => ({ type: HIDE_LUMISECTION_MODAL });

const INITIAL_STATE = {
    show_waiting_list: false,
    configuration_modal_visible: false,
    configuration_modal_type: '',
    manage_dataset_modal_visible: false,
    manage_dataset_modal_dataset: {},
    lumisection_modal_visible: false,
    lumisection_modal_dataset: {},
    create_cycle_modal_visible: false
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case TOGGLE_SHOW_WAITING_LIST:
            return { ...state, show_waiting_list: payload };
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
        case SHOW_MANAGE_DATASET_MODAL:
            return {
                ...state,
                manage_dataset_modal_visible: true,
                manage_dataset_modal_dataset: payload
            };
        case HIDE_MANAGE_DATASET_MODAL:
            return {
                ...state,
                manage_dataset_modal_visible: false
            };
        case SHOW_LUMISECTION_MODAL:
            return {
                ...state,
                lumisection_modal_visible: true,
                lumisection_modal_dataset: payload
            };
        case HIDE_LUMISECTION_MODAL:
            return { ...state, lumisection_modal_visible: false };
        case SHOW_CREATE_CYCLE_MODAL:
            return { ...state, create_cycle_modal_visible: true };
        case HIDE_CREATE_CYCLE_MODAL:
            return { ...state, create_cycle_modal_visible: false };
        default:
            return state;
    }
}
