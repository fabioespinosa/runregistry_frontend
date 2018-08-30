import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import datasets from './datasets';
// import lumisection_ranges from './lumisection_ranges';
import workspace from './workspace';
import datasets_accepted from './datasets_accepted';
import ui from './ui';

const offlineRootReducer = combineReducers({
    classifiers,
    datasets,
    // lumisection_ranges,
    workspace,
    datasets_accepted,
    ui
});

export default offlineRootReducer;
