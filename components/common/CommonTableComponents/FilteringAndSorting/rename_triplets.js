import { rr_attributes } from '../../../../config/config';

// SQL Understands a dot syntax for JSONB values (in this case triplets), they are transformed to this syntax in this function
// filtering is true if the user is trying to filter, not to sort
const rename_triplets = (original_criteria, filtering) => {
    return original_criteria.map(filter => {
        // We copy the filter:
        const new_filter = { ...filter };
        // If its just sorting no need for upper case, but if its filtering yes (because in back end they are stored uppercase):
        if (rr_attributes.includes(filter.id) && !filter.id.includes('.')) {
            new_filter.id = `rr_attributes.${filter.id}`;
        } else if (filter.id === 'name') {
            new_filter.id = 'name';
        } else if (
            !rr_attributes.includes(filter.id) &&
            !filter.id.includes('.') &&
            !filter.id.includes('-') &&
            !filter.id.includes('_state') &&
            !filter.id.includes('run_number')
        ) {
            new_filter.id = `oms_attributes.${filter.id}`;
        }

        if (filtering && new_filter.id === 'rr_attributes.state') {
            new_filter.value = filter.value.toUpperCase();
        }
        if (filter.id.includes('-')) {
            // If it includes '-' it is a triplet like tracker-pixel, all tripelts have a workspace and a column: {workspace}-{column}
            if (filtering) {
                new_filter.value = filter.value.toUpperCase();
            }
        }
        return new_filter;
    });
};

export default rename_triplets;
