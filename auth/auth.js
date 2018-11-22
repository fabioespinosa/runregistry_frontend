export default function(getState) {
    const state = getState();
    let email = state.info.adfs_email;
    let egroups = state.info.adfs_group;
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.ENV === 'development'
    ) {
        email = 'fespinos@cern.ch';
        egroups = 'CMS-Shiftlist_shifters_DQM_P5';
    }

    return {
        headers: {
            egroups,
            email
        }
    };
}
