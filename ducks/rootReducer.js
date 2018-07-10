import { combineReducers } from 'redux';
import online from './online/index';
import info from './info';

export const ROOT_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://api.onlinerunregistry.cern.ch'
        : 'http://localhost:3000';

const rootReducer = combineReducers({
    info,
    online
});

export default rootReducer;
