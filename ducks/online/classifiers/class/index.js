import { combineReducers } from 'redux';
import classifiers from './classifiers';
import ui from './ui';

const rootReducerClassClassifier = combineReducers({
    classifiers,
    ui
});

export default rootReducerClassClassifier;
