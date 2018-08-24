import { combineReducers } from 'redux';

// import classifiers from './classifiers/index';
// import runs from './runs';
// import lumisection_ranges from './lumisection_ranges';
import workspaces from './workspace';
import ui from './ui';

const offlineRootReducer = combineReducers({
    // classifiers,
    // runs,
    // lumisection_ranges,
    workspaces,
    ui
});

export default offlineRootReducer;
