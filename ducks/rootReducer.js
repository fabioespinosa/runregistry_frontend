import { combineReducers } from 'redux';
import online from './online/index';
import offline from './offline/index';
import json from './json/index';
import info from './info';
import global_ui from './global_ui';
import classifier_editor from './classifier_editor';

const rootReducer = combineReducers({
    info,
    online,
    offline,
    json,
    classifier_editor,
    global_ui
});

export default rootReducer;
