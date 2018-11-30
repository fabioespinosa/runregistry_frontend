import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import { Icon, Tooltip } from 'antd';
import Swal from 'sweetalert2';
import qs from 'qs';
import { components } from '../../../config/config';
import Status from '../../common/CommonTableComponents/Status';
import CommonValueComponent from '../../common/CommonTableComponents/CommonValueComponent';
import {
    moveRun,
    markSignificant,
    filterRuns,
    changeFilters
} from '../../../ducks/online/runs';
import {
    toggleTableFilters,
    showManageRunModal,
    showLumisectionModal
} from '../../../ducks/online/ui';
import ManageRunModal from '../manage_run/ManageRunModal';
import LumisectionModal from '../lumisections/LumisectionModal';

import ReactTable from 'react-table';

const column_filter_description = {
    string: '=, like, notlike, <>',
    date: '>, <, >=, <=, <>',
    component: '=, like, notlike, <>',
    boolean: 'true, false'
};
const column_types = {
    'hlt_key.value': 'string',
    'class.value': 'string',
    run_number: 'integer',
    class: 'string',
    significant: 'boolean',
    'state.value': 'string',
    b_field: 'integer',
    start_time: 'date',
    hlt_key: 'string',
    duration: 'integer',
    clock_type: 'string',
    component: 'component'
};

let defaultPageSize = 25;
let local_sortings = [];
class RunTable extends Component {
    // First time page loads, table grabs filter from query url, then goes and queries them:
    async componentDidMount() {
        let { url_filter } = this.props.run_table;
        const renamed_filters = rename_triplets(url_filter, true);
        const filters = formatFilters(renamed_filters);
        await this.props.filterRuns(defaultPageSize, 0, [], filters);
    }
    // When a user filters the table, the filters are persisted in the url string, this method takes care of that:
    applyFiltersToUrl = filters => {
        const object_filter = {};
        // Turn array filter into object:
        filters.forEach(filter => {
            object_filter[filter.id] = filter.value;
        });
        let { pathname, asPath } = this.props.router;
        const query = qs.stringify(object_filter);
        if (asPath.includes('?')) {
            pathname = pathname.split('?')[0];
            asPath = asPath.split('?')[0];
        }
        // Change filters in redux and in route:
        this.props.changeFilters(filters, object_filter);
        Router.push(`${pathname}?${query}`, `${asPath}?${query}`, {
            shallow: true
        });
        return filters;
    };
    // When a user filters the table, it goes and applies the filters to the url, then it filters the runs
    filterTable = async (filters, page, pageSize) => {
        this.applyFiltersToUrl(filters);
        const renamed_filters = rename_triplets(filters, true);
        const formated_filters = formatFilters(renamed_filters);
        await this.props.filterRuns(
            pageSize || defaultPageSize,
            page,
            [],
            formated_filters
        );
    };

    // Navigate entirely to a route without filters (when clicking remove filters)
    removeFilters = () => {
        let { asPath } = this.props.router;
        if (asPath.includes('?')) {
            asPath = asPath.split('?')[0];
        }
        window.location.href = `${window.location.origin}${asPath}`;
    };

    // When a user sorts by any field, we want to preserve the filters:
    sortTable = async (sortings, page, pageSize) => {
        let { url_filter } = this.props.run_table;
        const renamed_filters = rename_triplets(url_filter, true);
        const formated_filters = formatFilters(renamed_filters);
        const renamed_sortings = rename_triplets(sortings, false);
        const formated_sortings = formatSortings(renamed_sortings);
        await this.props.filterRuns(
            pageSize || defaultPageSize,
            page,
            formated_sortings,
            formated_filters
        );
    };
    onPageChange = async page => {
        this.sortTable(local_sortings, page);
    };
    onPageSizeChange = async (newSize, page) => {
        defaultPageSize = newSize;
        this.sortTable(local_sortings, page, newSize);
    };

    render() {
        const {
            filterable,
            run_table,
            show_all_runs,
            showManageRunModal,
            showLumisectionModal
        } = this.props;
        const { runs, pages, loading, filter, filters } = run_table;
        let columns = [
            {
                Header: 'Run Number',
                accessor: 'run_number',
                maxWidth: 110,
                resizable: false,
                Cell: ({ original, value }) => (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <a onClick={() => showManageRunModal(original)}>
                            {value}
                        </a>
                    </div>
                )
            },
            {
                Header: 'Class',
                accessor: 'class',
                Cell: ({ value }) => <CommonValueComponent value={value} />
            },
            {
                Header: 'Manage / LS',
                id: 'manage',
                filterable: false,
                sortable: false,
                maxWidth: 75,
                Cell: ({ original }) => (
                    <div style={{ textAlign: 'center' }}>
                        {/* PENDING MAKE IT SO THAT WHEN A RUN IS ONLY EDITABLE WHEN IN OPEN STATE */}
                        <span>
                            <a onClick={() => showManageRunModal(original)}>
                                Manage
                            </a>
                            {' / '}
                        </span>
                        <a onClick={evt => showLumisectionModal(original)}>
                            LS
                        </a>
                    </div>
                )
            },
            {
                Header: 'Significant',
                id: 'significant',
                accessor: 'significant',
                maxWidth: 100,
                filterable: show_all_runs && filterable,
                sortable: show_all_runs,
                Cell: ({ original, value }) => (
                    <div style={{ textAlign: 'center' }}>
                        {value.value ? (
                            <Icon type={'check'} />
                        ) : (
                            <a
                                onClick={async () => {
                                    const { value } = await Swal({
                                        type: 'warning',
                                        title:
                                            'Are you sure you want to make the run Significant',
                                        text: '',
                                        showCancelButton: true,
                                        confirmButtonText: 'Yes',
                                        reverseButtons: true,
                                        footer: '<a >What does this mean?</a>'
                                    });
                                    if (value) {
                                        await this.props.markSignificant(
                                            original
                                        );
                                        await Swal(
                                            `Run ${
                                                original.run_number
                                            } marked significant`,
                                            '',
                                            'success'
                                        );
                                    }
                                }}
                            >
                                Make significant
                            </a>
                        )}
                    </div>
                )
            },
            {
                Header: 'State',
                id: 'state',
                accessor: 'state',
                Cell: ({ original, value }) => {
                    if (original.significant.value) {
                        return (
                            <div style={{ textAlign: 'center' }}>
                                <span
                                    style={{
                                        color: 'white',
                                        fontSize: '0.95em',
                                        fontWeight: 'bold',
                                        color:
                                            value.value === 'OPEN'
                                                ? 'red'
                                                : 'grey',
                                        borderRadius: '1px'
                                    }}
                                >
                                    <span style={{ padding: '4px' }}>
                                        {value.value}
                                    </span>
                                </span>
                                {' / '}
                                <a
                                    onClick={async () => {
                                        const options = {
                                            OPEN: 'To OPEN',
                                            SIGNOFF: 'to SIGNOFF',
                                            COMPLETED: 'to COMPLETED'
                                        };
                                        delete options[value.value];
                                        const { value: to_state } = await Swal({
                                            title: `Move run ${
                                                original.run_number
                                            } to...`,
                                            input: 'select',
                                            inputOptions: options,
                                            showCancelButton: true,
                                            reverseButtons: true
                                        });
                                        if (to_state) {
                                            await this.props.moveRun(
                                                original,
                                                original.state.value,
                                                to_state
                                            );
                                            await Swal(
                                                `Run ${
                                                    original.run_number
                                                } Moved to ${to_state}`,
                                                '',
                                                'success'
                                            );
                                        }
                                    }}
                                >
                                    move
                                </a>
                            </div>
                        );
                    }
                }
            },
            { Header: 'Started', accessor: 'start_time' },
            {
                Header: 'Hlt Key Description',
                accessor: 'hlt_key',
                Cell: ({ value }) => <CommonValueComponent value={value} />
            },
            {
                Header: 'GUI',
                filterable: false,
                maxWidth: 40,
                Cell: ({ original }) => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            target="_blank"
                            href={`https://cmsweb.cern.ch/dqm/online/start?runnr=${
                                original.run_number
                            };sampletype=online_data;workspace=Summary`}
                        >
                            GUI
                        </a>
                    </div>
                )
            }
        ];

        const other_columns = [
            { Header: 'LS Duration', accessor: 'ls_duration' },
            { Header: 'B Field', accessor: 'b_field' },
            { Header: 'Clock Type', accessor: 'clock_type' }
        ];
        // Put components in format Header: component
        let component_columns = components.map(component => ({
            Header: component
        }));

        component_columns = component_columns.map(column => {
            return {
                ...column,
                maxWidth: 66,
                id: `${column['Header']}_triplet`,
                accessor: data => {
                    const triplet = data[`${column['Header']}_triplet`];
                    return triplet;
                },
                Cell: ({ original, value }) => (
                    <Status
                        triplet={value}
                        significant={original.significant.value}
                    />
                )
            };
        });
        columns = [...columns, ...component_columns, ...other_columns];
        // columns = component_columns;
        columns = columns.map(column => {
            return {
                ...column,
                Header: () => (
                    <div>
                        {column.Header}
                        &nbsp;&nbsp;
                        <Icon
                            onClick={evt => {
                                this.props.toggleTableFilters();
                                // The following is to stop react-table from performing a sort when a user just clicked on the magnifying glass to filter
                                evt.stopPropagation();
                            }}
                            type="search"
                            style={{ fontSize: '12px' }}
                        />
                    </div>
                ),
                Filter: ({ column, onChange }) => {
                    const { id } = column;
                    const type = column_types[id] || 'string';
                    const style = `
                        text-align: left;
                        border: 1px solid grey;
                        white-space: pre-wrap;
                        transition: all 1s;
                        margin-left: -10px;
                        margin-top: 20px;
                        padding: 9px;
                        width: 200px;
                        z-index: 900;
                        height: 270px;
                        background: white;
                        position: fixed;
                        display: none;`;
                    return (
                        <div
                            className="filter_selector"
                            style={{ zIndex: 999 }}
                        >
                            <input
                                defaultValue={filters[column.id]}
                                onMouseEnter={evt => {
                                    const block = document.querySelector(
                                        `#${column.id}`
                                    );
                                    block.setAttribute(
                                        'style',
                                        `${style} display: inline-block;`
                                    );
                                }}
                                onMouseLeave={({ clientX, clientY }) => {
                                    const block = document.querySelector(
                                        `#${column.id}`
                                    );
                                    block.setAttribute('style', style);
                                }}
                                type="text"
                                onKeyPress={evt => {
                                    if (evt.key == 'Enter') {
                                        onChange(evt.target.value);
                                    }
                                }}
                                style={
                                    { width: '100%' } // onChange={evt => onChange(evt.target.value)}
                                }
                            />
                            <div style={{ display: 'none' }} id={column.id}>
                                <h3
                                    style={{
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {type} filter
                                </h3>
                                Supported operators:{' '}
                                {column_filter_description[type]}
                                <p />
                                <p>Structure:</p>
                                <p>
                                    <i>operator</i> value <i>and/or</i>{' '}
                                    <i>operator</i> value
                                </p>
                                <p>Examples:</p>
                                <p>
                                    <i>{'='}</i> 322433
                                </p>
                                <p>
                                    <i>{'>'}</i> 40 <i>and</i> <i>{'<'}</i> 100{' '}
                                    <i>or</i> <i>{'>'}</i> 500
                                </p>
                                <p>
                                    <i>{'like'}</i> %physics% <i>and</i>{' '}
                                    <i>{'like'}</i> %2018%
                                </p>
                                <p>
                                    <strong>
                                        {
                                            'Space between operator and value is mandatory'
                                        }
                                    </strong>
                                </p>
                            </div>
                        </div>
                    );
                }
            };
        });
        return (
            <div>
                <ManageRunModal />
                <LumisectionModal />
                Hold <i>shift</i> for multiple column sorting
                {filter && (
                    <div
                        style={{
                            width: '100%',
                            backgroundColor: 'rgba(1,0.1,0.1,0.1)'
                        }}
                    >
                        <h3
                            style={{
                                color: 'red',
                                display: 'inline-block',
                                marginBottom: 0
                            }}
                        >
                            Filter/Sorting are ON
                        </h3>
                        {'    -    '}
                        <a onClick={this.removeFilters}>
                            Click here to remove filters and sortings
                        </a>
                    </div>
                )}
                <ReactTable
                    columns={columns}
                    manual
                    data={
                        runs // Forces table not to paginate or sort automatically, so we can handle it server-side
                    }
                    pages={pages}
                    loading={
                        loading // Display the total number of pages
                    }
                    onPageChange={page => {
                        this.onPageChange(page);
                    }}
                    onPageSizeChange={(pageSize, page) =>
                        this.onPageSizeChange(pageSize, page)
                    }
                    onFilteredChange={(filtered, column, table) => {
                        // 0 is for first page
                        this.filterTable(filtered, 0);
                    }}
                    onSortedChange={sortings => {
                        local_sortings = sortings;
                        // 0 is for first page
                        this.sortTable(sortings, 0);
                    }}
                    filterable={filterable}
                    defaultPageSize={
                        defaultPageSize // Request new data when things change
                    }
                    className="-striped -highlight"
                />
                <br />
                <style jsx global>{`
                    .ReactTable .rt-th,
                    .ReactTable .rt-td {
                        font-size: 11px;
                        padding: 3px 3px !important;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        show_all_runs: state.online.ui.show_all_runs,
        filterable: state.online.ui.table.filterable,
        run_table: state.online.runs
    };
};

// SQL Understands a dot syntax for JSONB values (in this case triplets), they are transformed to this syntax in this function
// filtering is true if the user is trying to filter, not to sort
const rename_triplets = (original_criteria, filtering) => {
    return original_criteria.map(filter => {
        const new_filter = { ...filter };
        if (
            filter.id === 'state' ||
            filter.id === 'significant' ||
            filter.id === 'class' ||
            filter.id === 'hlt_key' ||
            filter.id === 'hlt_physics_counter'
        ) {
            new_filter.id = `${filter.id}.value`;
            // If its just sorting no need for upper case, but if its filtering yes (because in back end they are stored uppercase):
            if (filtering && filter.id === 'state') {
                new_filter.value = filter.value.toUpperCase();
            }
        }
        if (filter.id.includes('_triplet')) {
            new_filter.id = `${filter.id}.status`;
            if (filtering) {
                new_filter.value = filter.value.toUpperCase();
            }
        }
        return new_filter;
    });
};

const formatFilters = original_filters => {
    const column_filters = {};
    original_filters.forEach(({ id, value }) => {
        value = value.replace(',', ' '); // Replace commas for spaces, useful for input of runs in syntax: 325334, 234563
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
        let multiple_ids = false;
        // Special case if its for id runs  separated by commas: 325334, 234563
        if (criteria.length > 1) {
            if (!isNaN(criteria[0]) && !isNaN(criteria[1])) {
                const or = criteria.map(run_number => {
                    return {
                        '=': run_number
                    };
                });
                query = { or };
                multiple_ids = true;
            }
        }
        // Format And/Or up to three levels:
        if (criteria.length === 2 && !multiple_ids) {
            query = { [criteria[0]]: criteria[1] };
        }
        if (criteria.length === 5 && !multiple_ids) {
            query = {
                [criteria[2]]: [
                    { [criteria[0]]: criteria[1] },
                    { [criteria[3]]: criteria[4] }
                ]
            };
        }
        if (criteria.length === 8 && !multiple_ids) {
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
            throw 'query invalid';
        }
        column_filters[id] = query;
    });
    return column_filters;
};

const formatSortings = original_sortings => {
    return original_sortings.map(sorting => [
        sorting.id,
        sorting.desc ? 'DESC' : 'ASC'
    ]);
};

export default withRouter(
    connect(
        mapStateToProps,
        {
            filterRuns,
            toggleTableFilters,
            showManageRunModal,
            showLumisectionModal,
            changeFilters,
            moveRun,
            markSignificant
        }
    )(RunTable)
);
