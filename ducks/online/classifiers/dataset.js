import axios from 'axios';
import { error_handler } from '../../../utils/error_handlers';
import { api_url } from '../../../config/config';
import auth from '../../../auth/auth';
import { hideJsonEditor } from '../../classifier_editor';
const FETCH_DATASET_CLASSIFIERS = 'FETCH_DATASET_CLASSIFIERS';
const NEW_DATASET_CLASSIFIER = 'NEW_DATASET_CLASSIFIER';
const EDIT_DATASET_CLASSIFIER = 'EDIT_DATASET_CLASSIFIER';
const DELETE_DATASET_CLASSIFIER = 'DELETE_DATASET_CLASSIFIER';

export const fetchDatasetClassifiers = () => async dispatch => {
    const { data: classifiers } = await axios.get(
        `${api_url}/classifiers/dataset`
    );
    dispatch({ type: FETCH_DATASET_CLASSIFIERS, payload: classifiers });
};

export const newDatasetClassifier = (new_classifier, class_selected) =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.post(
            `${api_url}/classifiers/dataset`,
            {
                classifier: new_classifier,
                class: class_selected,
                // This are for testing:
                enabled: true
            },
            auth(getState)
        );
        classifier.classifier = JSON.stringify(classifier.classifier);
        dispatch({ type: NEW_DATASET_CLASSIFIER, payload: classifier });
        dispatch(hideJsonEditor());
    });

export const deleteDatasetClassifier = classifier_id =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.delete(
            `${api_url}/classifiers/dataset/${classifier_id}`,
            auth(getState)
        );
        dispatch({
            type: DELETE_DATASET_CLASSIFIER,
            payload: classifier.id
        });
    });

export const editDatasetClassifier = (new_classifier, class_selected) =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.put(
            `${api_url}/classifiers/dataset/${new_classifier.id}`,
            { ...new_classifier, class: class_selected },
            auth(getState)
        );
        dispatch({
            type: EDIT_DATASET_CLASSIFIER,
            payload: classifier
        });
        dispatch(hideJsonEditor());
    });

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_DATASET_CLASSIFIERS:
            return payload;
        case NEW_DATASET_CLASSIFIER:
            return state.concat(payload);
        case DELETE_DATASET_CLASSIFIER:
            return deleteDatasetClassifierHelper(state, payload);
        case EDIT_DATASET_CLASSIFIER:
            return editDatasetClassifierHelper(state, payload);
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

const deleteDatasetClassifierHelper = (classifiers, classifier_id) => {
    const index = findId(classifiers, classifier_id);
    return [...classifiers.slice(0, index), ...classifiers.slice(index + 1)];
};

const editDatasetClassifierHelper = (classifiers, classifier) => {
    const index = findId(classifiers, classifier.id);
    return [
        ...classifiers.slice(0, index),
        classifier,
        ...classifiers.slice(index + 1)
    ];
};
