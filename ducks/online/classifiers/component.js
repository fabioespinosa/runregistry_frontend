import axios from 'axios';

import { errorHandler as eh } from '../../../utils/error_handlers';
import { api_url } from '../../../config/config';
import { hideJsonEditor } from '../../classifier_editor';
const FETCH_COMPONENT_CLASSIFIERS = 'FETCH_COMPONENT_CLASSIFIERS';
const NEW_COMPONENT_CLASSIFIER = 'NEW_COMPONENT_CLASSIFIER';
const EDIT_COMPONENT_CLASSIFIER = 'EDIT_COMPONENT_CLASSIFIER';
const DELETE_COMPONENT_CLASSIFIER = 'DELETE_COMPONENT_CLASSIFIER';

export const fetchComponentClassifiers = component => async dispatch => {
    const { data: classifiers } = await axios.get(
        `${api_url}/classifiers/component/filter_by_component/${component}`
    );
    dispatch({ type: FETCH_COMPONENT_CLASSIFIERS, payload: classifiers });
};

export const newComponentClassifier = (
    new_classifier,
    status_selected,
    component
) => async dispatch => {
    const { data: classifier } = await axios.post(
        `${api_url}/classifiers/component`,
        {
            classifier: new_classifier,
            status: status_selected,
            component,
            // This are for testing:
            priority: 1,
            enabled: true,
            category: 'class'
        }
    );
    classifier.classifier = JSON.stringify(classifier.classifier);
    dispatch({ type: NEW_COMPONENT_CLASSIFIER, payload: classifier });
    dispatch(hideJsonEditor());
};

export const deleteComponentClassifier = classifier_id => async dispatch => {
    const { data: classifier } = await axios.delete(
        `${api_url}/classifiers/component/${classifier_id}`
    );
    dispatch({
        type: DELETE_COMPONENT_CLASSIFIER,
        payload: classifier.id
    });
};

export const editComponentClassifier = new_classifier => async dispatch => {
    const { data: classifier } = await axios.put(
        `${api_url}/classifiers/component/${new_classifier.id}`,
        new_classifier
    );
    dispatch({ type: EDIT_COMPONENT_CLASSIFIER, payload: classifier });
    dispatch(hideJsonEditor());
};

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_COMPONENT_CLASSIFIERS:
            return payload;
        case NEW_COMPONENT_CLASSIFIER:
            return state.concat(payload);
        case DELETE_COMPONENT_CLASSIFIER:
            return deleteComponentClassifierHelper(state, payload);
        case EDIT_COMPONENT_CLASSIFIER:
            return editComponentClassifierHelper(state, payload);
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

const deleteComponentClassifierHelper = (classifiers, classifier_id) => {
    const index = findId(classifiers, classifier_id);
    return [...classifiers.slice(0, index), ...classifiers.slice(index + 1)];
};

const editComponentClassifierHelper = (classifiers, classifier) => {
    const index = findId(classifiers, classifier.id);
    return [
        ...classifiers.slice(0, index),
        classifier,
        ...classifiers.slice(index + 1)
    ];
};
