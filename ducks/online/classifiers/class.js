import axios from 'axios';

import { errorHandler as eh } from '../../../utils/error_handlers';
import { api_url } from '../../../config/config';
import { hideJsonEditor } from '../../classifier_editor';
const FETCH_CLASS_CLASSIFIERS = 'FETCH_CLASS_CLASSIFIERS';
const NEW_CLASS_CLASSIFIER = 'NEW_CLASS_CLASSIFIER';
const EDIT_CLASS_CLASSIFIER = 'EDIT_CLASS_CLASSIFIER';
const DELETE_CLASS_CLASSIFIER = 'DELETE_CLASS_CLASSIFIER';

export const fetchClassClassifiers = () => async dispatch => {
    const { data: classifiers } = await axios.get(
        `${api_url}/classifiers/class`
    );
    dispatch({ type: FETCH_CLASS_CLASSIFIERS, payload: classifiers });
};

export const newClassClassifier = (
    new_classifier,
    class_selected
) => async dispatch => {
    const { data: classifier } = await axios.post(
        `${api_url}/classifiers/class`,
        {
            classifier: new_classifier,
            class: class_selected,
            // This are for testing:
            priority: 1,
            enabled: true
        }
    );
    classifier.classifier = JSON.stringify(classifier.classifier);
    dispatch({ type: NEW_CLASS_CLASSIFIER, payload: classifier });
    dispatch(hideJsonEditor());
};

export const deleteClassClassifier = classifier_id => async dispatch => {
    const { data: classifier } = await axios.delete(
        `${api_url}/classifiers/class/${classifier_id}`
    );
    dispatch({
        type: DELETE_CLASS_CLASSIFIER,
        payload: classifier.id
    });
};

export const editClassClassifier = new_classifier => async dispatch => {
    const { data: classifier } = await axios.put(
        `${api_url}/classifiers/class/${new_classifier.id}`,
        new_classifier
    );
    dispatch({ type: EDIT_CLASS_CLASSIFIER, payload: classifier });
    dispatch(hideJsonEditor());
};

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_CLASS_CLASSIFIERS:
            return payload;
        case NEW_CLASS_CLASSIFIER:
            return state.concat(payload);
        case DELETE_CLASS_CLASSIFIER:
            return deleteClassClassifierHelper(state, payload);
        case EDIT_CLASS_CLASSIFIER:
            return editClassClassifierHelper(state, payload);
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

const deleteClassClassifierHelper = (classifiers, classifier_id) => {
    const index = findId(classifiers, classifier_id);
    return [...classifiers.slice(0, index), ...classifiers.slice(index + 1)];
};

const editClassClassifierHelper = (classifiers, classifier) => {
    const index = findId(classifiers, classifier.id);
    return [
        ...classifiers.slice(0, index),
        classifier,
        ...classifiers.slice(index + 1)
    ];
};
