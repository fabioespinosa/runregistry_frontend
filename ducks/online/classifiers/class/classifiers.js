import axios from 'axios';

import { errorHandler as eh } from '../../../../utils/error_handlers';
import { ROOT_URL } from '../../../rootReducer';
const FETCH_CLASS_CLASSIFIERS = 'FETCH_CLASS_CLASSIFIERS';
const NEW_CLASS_CLASSIFIER = 'NEW_CLASS_CLASSIFIER';
const EDIT_CLASS_CLASSIFIER = 'EDIT_CLASS_CLASSIFIER';
const DELETE_CLASS_CLASSIFIER = 'DELETE_CLASS_CLASSIFIER';

export const fetchClassClassifiers = () => async dispatch => {
    const { data: classifiers } = await axios.get(
        `${ROOT_URL}/classifiers/class`
    );
    dispatch({ type: FETCH_CLASS_CLASSIFIERS, payload: classifiers });
};

export const newClassClassifier = new_classifier => async dispatch => {
    const { data: classifier } = await axios.post(`${ROOT_URL}/classifiers`, {
        classifier: new_classifier,
        // This are for testing:
        priority: 1,
        enabled: true,
        category: 'class'
    });
    classifier.classifier = JSON.stringify(classifier.classifier);
    dispatch({ type: NEW_CLASS_CLASSIFIER, payload: classifier });
};

export const deleteClassClassifier = classifier_id => async dispatch => {
    const { data: classifier } = await axios.delete(
        `${ROOT_URL}/classifiers/${classifier_id}`
    );
    dispatch({
        type: DELETE_CLASS_CLASSIFIER,
        payload: classifier.id
    });
};

export const editClassClassifier = new_classifier => async dispatch => {
    const { data: classifier } = await axios.put(
        `${ROOT_URL}/classifiers/${new_classifier.id}`,
        { new_classifier }
    );
    dispatch({ type: EDIT_CLASS_CLASSIFIER, payload: classifier });
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
