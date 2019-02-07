import axios from 'axios';

import { error_handler } from '../../../utils/error_handlers';
import { api_url } from '../../../config/config';
import auth from '../../../auth/auth';
import { hideJsonEditor } from '../../classifier_editor';
const FETCH_CLASS_CLASSIFIERS = 'FETCH_CLASS_CLASSIFIERS';

export const fetchClassClassifiers = () =>
    error_handler(async dispatch => {
        const { data: classifiers } = await axios.get(
            `${api_url}/classifiers/class`
        );
        dispatch({ type: FETCH_CLASS_CLASSIFIERS, payload: classifiers });
    });

export const newClassClassifier = (new_classifier, class_selected, priority) =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.post(
            `${api_url}/classifiers/class`,
            {
                classifier: new_classifier,
                class: class_selected,
                priority,
                // This are for testing:
                enabled: true
            },
            auth(getState)
        );
        classifier.classifier = JSON.stringify(classifier.classifier);
        dispatch(fetchClassClassifiers());
        dispatch(hideJsonEditor());
    });

export const deleteClassClassifier = classifier_id =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.delete(
            `${api_url}/classifiers/class/${classifier_id}`,
            auth(getState)
        );
        dispatch(fetchClassClassifiers());
    });

export const editClassClassifier = (new_classifier, class_selected, priority) =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.put(
            `${api_url}/classifiers/class/${new_classifier.id}`,
            { ...new_classifier, class: class_selected, priority },
            auth(getState)
        );
        dispatch(fetchClassClassifiers());
        dispatch(hideJsonEditor());
    });

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_CLASS_CLASSIFIERS:
            return payload;
        default:
            return state;
    }
}
