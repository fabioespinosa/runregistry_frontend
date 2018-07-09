import { combineReducers } from 'redux';
import classifiers from './classifiers';
import ui from './ui';

const rootReducerDatasetClassifiers = combineReducers({
    classifiers,
    ui
});

export default rootReducerDatasetClassifiers;
