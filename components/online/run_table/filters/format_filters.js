const column_types = {
    hlt_key: 'string',
    'rr_attributes.class': 'string',
    run_number: 'integer',
    'rr_attributes.significant': 'boolean',
    'rr_attributes.state': 'string',
    'oms_attributes.b_field': 'integer',
    'oms_attributes.start_time': 'date',
    'oms_attributes.hlt_key': 'string',
    'oms_attributes.duration': 'integer',
    'oms_attributes.clock_type': 'string',
    component: 'component'
};
const format_filters = original_filters => {
    const column_filters = {};
    original_filters.forEach(({ id, value }) => {
        if (
            id.includes('_triplet') &&
            [
                'GOOD',
                'STANDBY',
                'BAD',
                'NOTSET',
                'NO VALUE FOUND',
                'EMPTY'
            ].includes(value)
        ) {
            column_filters[`triplet_summary.${id}.${value}`] = { '>': 0 };
        }
    });
    original_filters = original_filters.filter(
        ({ id }) => !id.includes('_triplet')
    );
    original_filters.forEach(({ id, value }) => {
        value = value.replace(/,/g, ' '); // Replace commas for spaces, useful for input of runs in syntax: 325334, 234563
        value = value.trim().replace(/ +/g, ' '); // Replace more than one space for 1 space
        const criteria = value.split(' ').filter(arg => arg !== '');
        let query = {};
        if (criteria.length === 1) {
            // If user types '=' or '<' alike operator, do not perform default 'like' or '=':
            if (['=', '<', '>', '<=', '>='].includes(criteria[0][0])) {
                const operator = criteria[0][0];
                criteria[0] = criteria[0].substring(1);
                criteria.unshift(operator);
            } else if (column_types[id] === 'string') {
                // If it is a string, default is like:
                criteria[0] = `%${criteria[0]}%`;
                criteria.unshift('like');
            } else {
                // Else, default is operator '='
                criteria.unshift('=');
            }
        }
        let multiple_runnumbers = false;
        // Special case if its for id runs  separated by commas: 325334, 234563
        if (criteria.length > 1) {
            if (!isNaN(criteria[0]) && !isNaN(criteria[1])) {
                const or = criteria.map(run_number => {
                    return {
                        '=': run_number
                    };
                });
                query = { or };
                multiple_runnumbers = true;
            }
        }
        // Format And/Or up to three levels:
        if (criteria.length === 2 && !multiple_runnumbers) {
            query = { [criteria[0]]: criteria[1] };
        }
        if (criteria.length === 5 && !multiple_runnumbers) {
            query = {
                [criteria[2]]: [
                    { [criteria[0]]: criteria[1] },
                    { [criteria[3]]: criteria[4] }
                ]
            };
        }
        if (criteria.length === 8 && !multiple_runnumbers) {
            query = {
                [criteria[5]]: [
                    { [criteria[6]]: criteria[7] },
                    {
                        [criteria[2]]: [
                            { [criteria[0]]: criteria[1] },
                            { [criteria[3]]: criteria[4] }
                        ]
                    }
                ]
            };
        }
        // If query is blank, there was an error in query format
        if (Object.keys(query).length === 0) {
            Swal('Invalid query', '', 'warning');
            throw 'query invalid';
        }

        column_filters[id] = query;
    });
    return column_filters;
};
export default format_filters;
