import axios from 'axios';
import { api_url } from '../../config/config';

const FETCH_WORKSPACES = 'FETCH_WORKSPACES';
const ADD_COLUMN = 'ADD_COLUMN';
const REMOVE_COLUMN = 'REMOVE_COLUMN';

export const fetchWorkspaces = async store => {
    const { data: workspaces } = await axios.get(`${api_url}/workspaces`);
    store.dispatch({
        type: FETCH_WORKSPACES,
        payload: workspaces
    });
};

export const addColumn = (pog, column) => async dispatch => {
    const { data: workspaces } = await axios.post(`${api_url}/workspaces`);
    dispatch({
        type: ADD_COLUMN,
        payload: workspaces
    });
    // fetch table again
};

export const removeColumn = (pog, column) => async dispatch => {
    const { data: workspaces } = await axios.delete(`${api_url}/workspaces`);
    dispatch({
        type: REMOVE_COLUMN,
        payload: workspaces
    });
    // fetch table again
};

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_WORKSPACES:
            return payload;
        case ADD_COLUMN:
            return payload;
        case REMOVE_COLUMN:
            return payload;
        default:
            return state;
    }
}
