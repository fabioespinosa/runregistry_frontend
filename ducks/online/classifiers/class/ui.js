const EDIT_CLASS_CLASSIFIER_INTENT = 'EDIT_CLASS_CLASSIFIER_INTENT';
const HIDE_JSON_EDITOR = 'HIDE_JSON_EDITOR';
const EDITOR_SAVE_LOADING = 'EDITOR_SAVE_LOADING';
const EDITOR_SAVE_LOADING_OFF = 'EDITOR_SAVE_LOADING_OFF';
const NEW_CLASS_CLASSIFIER_INTENT = 'NEW_CLASS_CLASSIFIER_INTENT';

export const editClassClassifierIntent = () => ({
    type: EDIT_CLASS_CLASSIFIER_INTENT
});

export const newClassClassifierIntent = () => ({
    type: NEW_CLASS_CLASSIFIER_INTENT
});

export const hideJsonEditor = () => ({
    type: HIDE_JSON_EDITOR
});

export const editClassifierLoading = () => ({ type: EDITOR_SAVE_LOADING });

export const editClassifierLoadingStop = () => ({
    type: EDITOR_SAVE_LOADING_OFF
});

const INITIAL_STATE = {
    json_editor: false,
    editor_save_loading: false
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case EDIT_CLASS_CLASSIFIER_INTENT:
            return { ...state, json_editor: true };
        case HIDE_JSON_EDITOR:
            return { ...state, json_editor: false };
        case EDITOR_SAVE_LOADING:
            return { ...state, editor_save_loading: true };
        case EDITOR_SAVE_LOADING_OFF:
            return { ...state, editor_save_loading: false };
        case NEW_CLASS_CLASSIFIER_INTENT:
            return { ...state, json_editor: true };
        default:
            return state;
    }
}
