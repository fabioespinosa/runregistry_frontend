const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    const { type } = action;
    switch (type) {
        default:
            return state;
    }
};
