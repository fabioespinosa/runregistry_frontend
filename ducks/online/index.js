import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import runs from './runs';
import lumisection_ranges from './lumisection_ranges';
import ui from './ui';

const onlineRootReducer = combineReducers({
    classifiers,
    runs,
    lumisection_ranges,
    ui
});

export default onlineRootReducer;
