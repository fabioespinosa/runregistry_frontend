import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import runs from './runs';
import significant_runs from './significant_runs';
import lumisections from './lumisections';
import ui from './ui';
import workspace from './workspace';

const onlineRootReducer = combineReducers({
    classifiers,
    runs,
    significant_runs,
    lumisections,
    workspace,
    ui
});

export default onlineRootReducer;
