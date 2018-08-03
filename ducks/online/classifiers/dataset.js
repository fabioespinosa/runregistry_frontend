// COPIED FROM CLASS CLASSIFIERS
import axios from 'axios';
import { api_url } from '../../../config/config';
const FETCH_DATASET_CLASSIFIERS = 'FETCH_DATASET_CLASSIFIERS';
const NEW_DATASET_CLASSIFIER = 'NEW_DATASET_CLASSIFIER';
const EDIT_DATASET_CLASSIFIER = 'EDIT_DATASET_CLASSIFIER';
const DELETE_DATASET_CLASSIFIER = 'DELETE_DATASET_CLASSIFIER';

export const fetchDatasetClassifiers = () => async dispatch => {
    const { data: classifiers } = await axios.get(
        `${api_url}/classifiers/class`
    );
    dispatch({ type: FETCH_DATASET_CLASSIFIERS, payload: classifiers });
};

export const newDatasetClassifier = new_classifier => async dispatch => {
    const { data: classifier } = await axios.post(
        `${api_url}/classifiers/dataset`,
        {
            classifier: new_classifier,
            // This are for testing:
            priority: 1,
            enabled: true
        }
    );
    classifier.classifier = JSON.stringify(classifier.classifier);
    dispatch({ type: NEW_DATASET_CLASSIFIER, payload: classifier });
};

export const deleteDatasetClassifier = () => async dispatch => {
    const { data: classifier } = await axios.delete(
        `${api_url}/classifiers/class/${classifier_id}`
    );
    dispatch({ type: DELETE_DATASET_CLASSIFIER, payload: classifier.id });
};

export const editClassClassifier = () => async dispatch => {
    const { data: classifier } = await axios.put(
        `${api_url}/classifiers/class/${new_classifier.id}`,
        new_classifier
    );
    dispatch({ type: EDIT_DATASET_CLASSIFIER, payload: classifier });
    dispatch(hideJsonEditor());
};

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_DATASET_CLASSIFIERS:
            return payload;
        case NEW_DATASET_CLASSIFIER:
            return state.concat(payload);
        case DELETE_DATASET_CLASSIFIER:
            return deleteDatasetClassifierHelper(payload);
        default:
            return state;
    }
}

const findId = (classifiers, id) => {
    for (let i = 0; i < classifiers.length; i++) {
        if (classifiers[i].id === id) {
            return i;
        }
    }
};

const deleteDatasetClassifierHelper = (classifiers, id) => {
    const index = findId(classifiers, id);
    return [...classifiers.slice(0, index), ...classifiers.slice(index + 1)];
};
