const SHOW_LUMISECTION_MODAL = 'SHOW_LUMISECTION_MODAL-ONLINE';
const HIDE_LUMISECTION_MODAL = 'HIDE_LUMISECTION_MODAL-ONLINE';

export const showLumisectionModal = run => ({
    type: SHOW_LUMISECTION_MODAL,
    payload: run
});

export const hideLumisectionModal = () => ({ type: HIDE_LUMISECTION_MODAL });
const INITIAL_STATE = {
    lumisection_modal_visible: false,
    lumisection_modal_dataset: {}
};
export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case SHOW_LUMISECTION_MODAL:
            return {
                ...state,
                lumisection_modal_visible: true,
                lumisection_modal_dataset: payload
            };
        case HIDE_LUMISECTION_MODAL:
            return {
                ...state,
                lumisection_modal_visible: false,
                lumisection_modal_dataset: {}
            };

        default:
            return state;
    }
}
