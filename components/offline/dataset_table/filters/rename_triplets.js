// TODO: FIX filtering
// SQL Understands a dot syntax for JSONB values (in this case triplets), they are transformed to this syntax in this function
// filtering is true if the user is trying to filter, not to sort
const rename_triplets = (original_criteria, filtering) => {
    return original_criteria.map(filter => {
        const new_filter = { ...filter };
        if (filter.id.includes('state')) {
            // If its just sorting no need for upper case, but if its filtering yes (because in back end they are stored uppercase):
            if (filtering && filter.id === 'state') {
                new_filter.value = filter.value.toUpperCase();
            }
        }
        // make a separate case for class, since its a join from run
        // '-' is an indication of a status component
        if (filter.id.includes('-')) {
            if (filtering) {
                new_filter.value = filter.value.toUpperCase();
            }
        }
        return new_filter;
    });
};
export default rename_triplets;
