const NEW_CLASS_CLASSIFIER_INTENT = 'NEW_CLASS_CLASSIFIER_INTENT';
const EDIT_CLASS_CLASSIFIER_INTENT = 'EDIT_CLASS_CLASSIFIER_INTENT';
const CHANGE_JSON_EDITOR = 'CHANGE_JSON_EDITOR';
const HIDE_JSON_EDITOR = 'HIDE_JSON_EDITOR';
const EDITOR_SAVE_LOADING = 'EDITOR_SAVE_LOADING';
const EDITOR_SAVE_LOADING_OFF = 'EDITOR_SAVE_LOADING_OFF';

export const editClassClassifierIntent = classifier => ({
    type: EDIT_CLASS_CLASSIFIER_INTENT,
    payload: classifier
});

export const newClassClassifierIntent = () => ({
    type: NEW_CLASS_CLASSIFIER_INTENT
});

export const changeJsonEditorValue = value => ({
    type: CHANGE_JSON_EDITOR,
    payload: value
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
    editor_save_loading: false,
    json_editor_value: ''
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case NEW_CLASS_CLASSIFIER_INTENT:
            return {
                ...state,
                json_editor: true,
                editing: false,
                json_editor_value: ''
            };
        case EDIT_CLASS_CLASSIFIER_INTENT:
            return {
                ...state,
                json_editor: true,
                editing: true,
                editing_classifier: payload,
                json_editor_value: payload.classifier
            };
        case CHANGE_JSON_EDITOR:
            return { ...state, json_editor_value: payload };
        case HIDE_JSON_EDITOR:
            return {
                ...state,
                json_editor: false,
                editing_classifier: undefined,
                editing: false,
                json_editor_value: ''
            };
        case EDITOR_SAVE_LOADING:
            return { ...state, editor_save_loading: true };
        case EDITOR_SAVE_LOADING_OFF:
            return { ...state, editor_save_loading: false };
        default:
            return state;
    }
}
