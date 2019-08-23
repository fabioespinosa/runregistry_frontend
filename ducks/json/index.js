import { combineReducers } from 'redux';
import configuration from './configuration';
import datasets from './datasets';
import ui from './ui';

const jsonRootReducer = combineReducers({
    configuration,
    datasets,
    ui
});

export default jsonRootReducer;
