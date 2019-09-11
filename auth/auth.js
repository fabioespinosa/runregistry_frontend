export default function(getState, comment) {
    const state = getState();
    let email = state.info.email;
    let egroups = state.info.egroups;
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.ENV === 'development'
    ) {
        email = 'fespinos@cern.ch';
        egroups = 'cms-dqm-runregistry-experts';
    }

    return {
        headers: {
            egroups,
            email,
            comment
        }
    };
}
