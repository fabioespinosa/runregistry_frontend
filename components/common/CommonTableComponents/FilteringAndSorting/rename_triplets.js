import { rr_attributes, dataset_attributes } from '../../../../config/config';

// SQL Understands a dot syntax for JSONB values (in this case triplets), they are transformed to this syntax in this function
// filtering is true if the user is trying to filter, not to sort
const rename_triplets = (original_criteria, filtering) => {
    return original_criteria.map(({ id, value }) => {
        // We copy the filter:
        const new_filter = { id, value };
        // If its just sorting no need for upper case, but if its filtering yes (because in back end they are stored uppercase):
        if (rr_attributes.includes(id) && !id.includes('.')) {
            new_filter.id = `rr_attributes.${id}`;
        } else if (id === 'name') {
            new_filter.id = 'name';
        } else if (dataset_attributes.includes(id)) {
            new_filter.id = `dataset_attributes.${id}`;
        } else if (
            !rr_attributes.includes(id) &&
            !id.includes('.') &&
            !id.includes('-') &&
            !id.includes('_state') &&
            !id.includes('run_number')
        ) {
            new_filter.id = `oms_attributes.${id}`;
        }

        if (filtering && new_filter.id === 'rr_attributes.state') {
            new_filter.value = value.toUpperCase();
        }
        if (id.includes('-')) {
            // If it includes '-' it is a triplet like tracker-pixel, all triplets have a workspace and a column: {workspace}-{column}
            if (filtering) {
                new_filter.value = value.toUpperCase();
            }
        }
        return new_filter;
    });
};

export default rename_triplets;
