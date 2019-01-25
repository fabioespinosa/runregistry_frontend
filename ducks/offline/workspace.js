process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import axios from 'axios';
import { api_url } from '../../config/config';
import { filterDatasets } from './datasets';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';

const FETCH_WORKSPACES = 'FETCH_WORKSPACES';
const CHANGE_WORKSPACE = 'CHANGE_WORKSPACE';
const ADD_COLUMN = 'ADD_COLUMN';
const REMOVE_COLUMN = 'REMOVE_COLUMN';

export const fetchWorkspaces = error_handler(
    async (store, { workspace }, isServer) => {
        const { data: workspaces } = await axios.get(`${api_url}/workspaces`);
        store.dispatch({
            type: FETCH_WORKSPACES,
            payload: workspaces
        });
        store.dispatch({
            type: CHANGE_WORKSPACE,
            payload: workspace
        });
    }
);

export const addColumn = (pog, column) =>
    error_handler(async (dispatch, getState) => {
        const { data: workspaces } = await axios.post(
            `${api_url}/workspaces`,
            { pog, column },
            auth(getState)
        );
        dispatch({
            type: ADD_COLUMN,
            payload: workspaces
        });
        // fetch table again
    });

export const removeColumn = (pog, column) =>
    error_handler(async (dispatch, getState) => {
        const { data: workspaces } = await axios.delete(
            `${api_url}/workspaces`,
            auth(getState)
        );
        dispatch({
            type: REMOVE_COLUMN,
            payload: workspaces
        });
        // fetch table again
    });

const INITIAL_STATE = { workspace: 'global', workspaces: {} };

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_WORKSPACES:
            return { ...state, workspaces: payload };
        case CHANGE_WORKSPACE:
            return { ...state, workspace: payload };
        case ADD_COLUMN:
            return { ...state, workspaces: payload };
        case REMOVE_COLUMN:
            return { ...state, workspaces: payload };
        default:
            return state;
    }
}
