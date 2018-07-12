import { combineReducers } from 'redux';

import classifiers from './classifiers/index';
import runs from './runs';
import ui from './ui';

const onlineRootReducer = combineReducers({
    runs,
    classifiers,
    ui
});

export default onlineRootReducer;
