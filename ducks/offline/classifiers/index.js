import { combineReducers } from 'redux';

import dataset from './dataset';
import component from './component';

const classifierRootReducer = combineReducers({
    dataset,
    component
});

export default classifierRootReducer;
