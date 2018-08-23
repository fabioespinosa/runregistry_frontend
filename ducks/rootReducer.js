import { combineReducers } from 'redux';
import online from './online/index';
import offline from './offline/index';
import info from './info';
import classifier_editor from './classifier_editor';

export const ROOT_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://cms-pdmv-dev.cern.ch/runregistry_api'
        : 'http://localhost:7002';

const rootReducer = combineReducers({
    info,
    online,
    offline,
    classifier_editor
});

export default rootReducer;
