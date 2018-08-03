import { combineReducers } from 'redux';
import class_classifier from './class';
import dataset from './dataset';

const classifierRootReducer = combineReducers({
    class: class_classifier,
    dataset
});

export default classifierRootReducer;
