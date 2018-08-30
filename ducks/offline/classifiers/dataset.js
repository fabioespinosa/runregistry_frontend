import axios from 'axios';
import { api_url } from '../../../config/config';
import { hideJsonEditor, editClassifierIntent } from '../../classifier_editor';
const FETCH_DATASET_CLASSIFIER = 'FETCH_DATASET_CLASSIFIER-OFFLINE';
const EDIT_DATASET_CLASSIFIER = 'EDIT_DATASET_CLASSIFIER-OFFLINE';

export const fetchDatasetClassifier = () => async dispatch => {
    const { data: classifier } = await axios.get(
        `${api_url}/classifiers/offline_dataset`
    );
    dispatch({ type: FETCH_DATASET_CLASSIFIER, payload: classifier[0] });
};

export const editDatasetClassifier = (
    new_classifier,
    class_selected
) => async dispatch => {
    const { data: classifier } = await axios.put(
        `${api_url}/classifiers/offline_dataset/${new_classifier.id}`,
        { ...new_classifier, class: class_selected }
    );
    dispatch({
        type: EDIT_DATASET_CLASSIFIER,
        payload: classifier
    });
};

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_DATASET_CLASSIFIER:
            return payload;
        case EDIT_DATASET_CLASSIFIER:
            return payload;
        default:
            return state;
    }
}
