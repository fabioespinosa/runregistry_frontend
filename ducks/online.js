const SHOW_CONFIGURATION_MODAL = 'SHOW_CONFIGURATION_MODAL';
const HIDE_CONFIGURATION_MODAL = 'HIDE_CONFIGURATION_MODAL';

export const showConfigurationModal = () => ({
    type: SHOW_CONFIGURATION_MODAL
});

export const hideConfigurationModal = () => ({
    type: HIDE_CONFIGURATION_MODAL
});

const INITIAL_STATE = {
    ui: {
        configuration_modal_visible: false
    }
};

export default (state = INITIAL_STATE, action) => {
    const { type } = action;
    switch (type) {
        case SHOW_CONFIGURATION_MODAL:
            return {
                ...state,
                ui: { ...state.ui, configuration_modal_visible: true }
            };
        case HIDE_CONFIGURATION_MODAL:
            return {
                ...state,
                ui: { ...state.ui, configuration_modal_visible: false }
            };
        default:
            return state;
    }
};
