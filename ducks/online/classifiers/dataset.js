import axios from 'axios';
import { error_handler } from '../../../utils/error_handlers';
import { api_url } from '../../../config/config';
import auth from '../../../auth/auth';
import { hideJsonEditor } from '../../classifier_editor';
const FETCH_DATASET_CLASSIFIERS = 'FETCH_DATASET_CLASSIFIERS';

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
        dispatch(fetchDatasetClassifiers());
        dispatch(hideJsonEditor());
    });

export const deleteDatasetClassifier = classifier_id =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.delete(
            `${api_url}/classifiers/dataset/${classifier_id}`,
            auth(getState)
        );
        dispatch(fetchDatasetClassifiers());
    });

export const editDatasetClassifier = (new_classifier, class_selected) =>
    error_handler(async (dispatch, getState) => {
        const { data: classifier } = await axios.put(
            `${api_url}/classifiers/dataset/${new_classifier.id}`,
            { ...new_classifier, class: class_selected },
            auth(getState)
        );
        dispatch(fetchDatasetClassifiers());
        dispatch(hideJsonEditor());
    });

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_DATASET_CLASSIFIERS:
            return payload;
        default:
            return state;
    }
}
