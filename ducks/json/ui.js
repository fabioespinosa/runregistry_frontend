import { error_handler } from '../../utils/error_handlers';

const SHOW_MODAL = 'SHOW_MODAL-JSON';
export const HIDE_MODAL = 'HIDE_MODAL-JSON';
const SELECT_DATASET_TO_VISUALIZE = 'SELECT_DATASET_TO_VISUALIZE';

export const showModal = modal_type => ({
    type: SHOW_MODAL,
    payload: modal_type
});

export const hideModal = () => ({
    type: HIDE_MODAL
});

export const visualizeDataset = dataset =>
    error_handler(async dispatch => {
        dataset = {
            dataset: {
                name: dataset.name
            },
            run: {
                run_number: dataset.run_number,
                rr: dataset.Run,
                oms: dataset.Run.oms_attributes
            },
            lumisection: {
                oms: transformTripletCacheToBoolean(
                    dataset.DatasetTripletCache.dcs_summary
                ),
                rr: transformTripletCacheToBoolean(
                    dataset.DatasetTripletCache.triplet_summary
                )
            }
        };
        dispatch({
            type: SELECT_DATASET_TO_VISUALIZE,
            payload: dataset
        });
        dispatch(showModal('visualize_json'));
    });

const transformTripletCacheToBoolean = contained_summary => {
    const boolean_summary = {};
    for (const [column, summary] of Object.entries(contained_summary)) {
        boolean_summary[column] = {};
        for (const [value, count] of Object.entries(summary)) {
            if (count > 0) {
                boolean_summary[column][value] = true;
            } else {
                boolean_summary[column][value] = false;
            }
        }
    }
    return boolean_summary;
};

const INITIAL_STATE = {
    modal_visible: false,
    modal_type: '',
    selected_dataset_to_visualize: {}
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case SHOW_MODAL:
            return {
                ...state,
                modal_visible: true,
                modal_type: payload
            };
        case HIDE_MODAL:
            return {
                ...state,
                modal_visible: false,
                modal_type: ''
            };
        case SELECT_DATASET_TO_VISUALIZE:
            return {
                ...state,
                selected_dataset_to_visualize: payload
            };
        default:
            return state;
    }
}
