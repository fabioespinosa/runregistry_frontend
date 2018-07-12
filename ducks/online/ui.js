const SHOW_CONFIGURATION_MODAL = 'SHOW_CONFIGURATION_MODAL';
export const HIDE_CONFIGURATION_MODAL = 'HIDE_CONFIGURATION_MODAL';
const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS';

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
    configuration_modal_visible: false,
    configuration_modal_type: '',
    table: {
        filterable: false
    }
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
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
