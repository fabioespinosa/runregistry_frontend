export default function(getState) {
    const state = getState();
    let email = state.info.adfs_email;
    let egroups = state.info.adfs_group;
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
            email
        }
    };
}
