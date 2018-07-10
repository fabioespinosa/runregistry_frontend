export function fetchInitialOnlineRuns(store, params) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
    // return axios
    //     .get(`${ROOT_URL}/online/runs`)
    //     .then(res => {
    //         store.dispatch({
    //             type: FETCH_INITIAL_RUNS,
    //             payload: res.data
    //         });
    //     })
    //     .catch(err => {
    //         store.dispatch({
    //             type: SHOW_NOTIFICATION,
    //             payload: {
    //                 notification_title:
    //                     'An error occurred fetching initial runs',
    //                 notification_message: err.response,
    //                 notification_type: 'danger'
    //             }
    //         });
    //     });
}

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        default:
            return state;
    }
}
