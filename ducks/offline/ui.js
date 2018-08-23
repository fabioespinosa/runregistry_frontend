const TOGGLE_SHOW_WAITING_LIST = 'TOGGLE_SHOW_WAITING_LIST';

export const toggleWaitingList = new_value => dispatch => {
    console.log(new_value);
    dispatch({
        type: TOGGLE_SHOW_WAITING_LIST,
        payload: new_value === 'show_waiting_list'
    });
    // dispatch(filterRuns(25, 0, [], []));
};

const INITIAL_STATE = {
    show_waiting_list: true
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case TOGGLE_SHOW_WAITING_LIST:
            return { ...state, show_waiting_list: payload };
        default:
            return state;
    }
}
