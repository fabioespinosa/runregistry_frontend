import axios from 'axios';
import { ROOT_URL } from './rootReducer';
const FETCH_INITIAL_RUNS = 'FETCH_INITIAL_RUNS-ONLINE';
const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const SHOW_CONFIGURATION_MODAL = 'SHOW_CONFIGURATION_MODAL';
const HIDE_CONFIGURATION_MODAL = 'HIDE_CONFIGURATION_MODAL';
const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS';

export function fetchInitialOnlineRuns(store) {
    return axios
        .get(`${ROOT_URL}/online/runs`)
        .then(res => {
            store.dispatch({
                type: FETCH_INITIAL_RUNS,
                payload: res.data
            });
        })
        .catch(err => {
            store.dispatch({
                type: SHOW_NOTIFICATION,
                payload: {
                    notification_title:
                        'An error occurred fetching initial runs',
                    notification_message: err.response,
                    notification_type: 'danger'
                }
            });
        });
}

export const showConfigurationModal = configuration_modal_type => {
    return {
        type: SHOW_CONFIGURATION_MODAL,
        payload: configuration_modal_type
    };
};

export const hideConfigurationModal = () => ({
    type: HIDE_CONFIGURATION_MODAL
});

export const toggleTableFilters = () => ({ type: TOGGLE_TABLE_FILTERS });

const INITIAL_STATE = {
    ui: {
        configuration_modal_visible: false,
        configuration_modal_type: '',
        table: {
            filterable: false
        }
    }
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_INITIAL_RUNS:
            return { ...state, runs: payload };
        case SHOW_CONFIGURATION_MODAL:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    configuration_modal_visible: true,
                    configuration_modal_type: payload
                }
            };
        case HIDE_CONFIGURATION_MODAL:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    configuration_modal_visible: false,
                    configuration_modal_type: ''
                }
            };
        case TOGGLE_TABLE_FILTERS:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    table: {
                        ...state.ui.table,
                        filterable: !state.ui.table.filterable
                    }
                }
            };
        default:
            return state;
    }
}
