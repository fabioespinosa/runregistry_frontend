import { combineReducers } from 'redux';
import online from './online';

export const ROOT_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://api.onlinerunregistry.cern.ch'
        : 'http://localhost:9000';

const rootReducer = combineReducers({
    online
});

export default rootReducer;
