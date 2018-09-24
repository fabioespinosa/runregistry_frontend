import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import datasets from './datasets';
import lumisections from './lumisections';
import workspace from './workspace';
import datasets_accepted from './datasets_accepted';
import ui from './ui';

const offlineRootReducer = combineReducers({
    classifiers,
    datasets,
    lumisections,
    workspace,
    datasets_accepted,
    ui
});

export default offlineRootReducer;
