import { combineReducers } from 'redux';
import class_classifier from './class';
import dataset from './dataset';
import component from './component';

const classifierRootReducer = combineReducers({
    class: class_classifier,
    dataset,
    component
});

export default classifierRootReducer;
