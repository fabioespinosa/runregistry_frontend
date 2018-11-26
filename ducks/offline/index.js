import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import datasets from './datasets';
import lumisections from './lumisections';
import workspace from './workspace';
import datasets_accepted from './datasets_accepted';
import ui from './ui';
import dc_tools from './dc_tools';

const offlineRootReducer = combineReducers({
    classifiers,
    datasets,
    lumisections,
    workspace,
    datasets_accepted,
    ui,
    dc_tools
});

export default offlineRootReducer;
