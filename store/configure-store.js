import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './../ducks/rootReducer';

const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');
    // middlewares.push(logger);
}

const configureStore = initialState => {
    return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middlewares),
            typeof window === 'object' &&
            typeof window.devToolsExtension !== 'undefined'
                ? window.devToolsExtension()
                : f => f
        )
    );
};

export default configureStore;
