import { combineReducers } from 'redux';
import online from './online/index';
import offline from './offline/index';
import info from './info';
import classifier_editor from './classifier_editor';

const rootReducer = combineReducers({
    info,
    online,
    offline,
    classifier_editor
});

export default rootReducer;
