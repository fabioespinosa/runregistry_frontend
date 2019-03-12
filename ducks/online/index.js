import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import runs from './runs';
import significant_runs from './significant_runs';
import lumisections from './lumisections';
import ui from './ui';

const onlineRootReducer = combineReducers({
    classifiers,
    runs,
    significant_runs,
    lumisections,
    ui
});

export default onlineRootReducer;
