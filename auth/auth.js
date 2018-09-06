export default function(getState) {
    const state = getState();
    return {
        headers: {
            'adfs-group': state.info.adfs_group
        }
    };
}
