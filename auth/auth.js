export default function(getState) {
    const state = getState();
    return {
        headers: {
            egroups: state.info.adfs_group,
            email: state.info.adfs_email
        }
    };
}
