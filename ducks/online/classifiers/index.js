import { combineReducers } from 'redux';
import class_classifier from './class/index';
import dataset from './dataset/index';

const classifierRootReducer = combineReducers({
    class: class_classifier
});

export default classifierRootReducer;
