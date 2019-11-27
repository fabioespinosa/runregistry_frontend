import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Button } from 'antd';
import { certifiable_offline_components } from '../../../config/config';

import {
    moveDataset,
    filterEditableDatasets,
    reGenerateCache
} from '../../../ducks/offline/datasets';
import { showManageDatasetModal } from '../../../ducks/offline/ui';
import { showLumisectionModal } from '../../../ducks/global_ui';
import { showConfigurationModal as showOfflineConfigurationModal } from '../../../ducks/offline/ui';
import format_filters from '../../common/CommonTableComponents/FilteringAndSorting/format_filters';
import format_sortings from '../../common/CommonTableComponents/FilteringAndSorting/format_sortings';
import rename_triplets from '../../common/CommonTableComponents/FilteringAndSorting/rename_triplets';

import ReactTable from 'react-table';
import column_generator from './columns/columns';

const generate_state_columns = () => {
    const columns = [];
    for (const [key, val] of Object.entries(certifiable_offline_components)) {
        columns.push({
            Header: `${key} state`,
            accessor: `${key}_state`,
            minWidth: 90,
            maxWidth: 90,
            Cell: ({ original, value }) => (
                <div style={{ textAlign: 'center' }}>
                    <span
                        style={{
                            color: 'white',
                            fontSize: '0.95em',
                            fontWeight: 'bold',
                            color: value === 'OPEN' ? 'red' : 'grey',
                            borderRadius: '1px'
                        }}
                    >
                        <span style={{ padding: '4px' }}>{value}</span>
                    </span>
                </div>
            )
        });
    }
    return columns;
};

class DatasetTable extends Component {
    constructor(props) {
        super(props);
        this.defaultPageSize = props.defaultPageSize;
    }
    state = {
        filterable: true,
        filters: [],
        sortings: [],
        loading: false,
        show_state_columsn: false
    };
    toggleShowFilters = () =>
        this.setState({ filterable: !this.state.filterable });

    async componentDidMount() {
        // If we are in the 'cycles', we rather let the Cycles.js component handle the filtering:
        const {
            router: {
                query: { section }
            }
        } = this.props;
        if (section !== 'cycles') {
            this.setState({ loading: true });
            await this.props.filterEditableDatasets(
                this.defaultPageSize,
                0,
                [],
                {}
            );
            this.setState({ loading: false });
        }
    }
    async componentDidUpdate(prevProps) {
        const {
            router: {
                query: { section, workspace }
            }
        } = this.props;
        const previous_query = prevProps.router.query;
        // Navigates between workspaces, we refetch and remove filters
        if (
            section !== 'cycles' &&
            (previous_query.section !== section ||
                previous_query.workspace !== workspace)
        ) {
            this.setState({ loading: true, filters: [], sortings: [] });
            await this.props.filterEditableDatasets(
                this.defaultPageSize,
                0,
                [],
                {}
            );
            this.setState({ loading: false });
        }
        // Navigates to cycles, we remove the previous filters:
        if (previous_query.section !== 'cycles' && section === 'cycles') {
            this.setState({ filters: [], sortings: [] });
        }

        // navigates between workspaces in cycles:
        if (
            section === 'cycles' &&
            (previous_query.section !== section ||
                previous_query.workspace !== workspace)
        ) {
            // fetch datasets for different workspaces
        }
    }

    convertFiltersToObject = filters => {
        const object_filter = {};
        // Turn array filter into object:
        filters.forEach(filter => {
            object_filter[filter.id] = filter.value;
        });
        return filters;
    };

    // When a user filters the table, it goes and applies the filters to the url, then it filters the runs
    filterTable = async (filters, page, pageSize) => {
        this.setState({ filters, loading: true });
        const { sortings } = this.state;
        const renamed_filters = rename_triplets(filters, true);
        const formated_filters = format_filters(renamed_filters);
        const renamed_sortings = rename_triplets(sortings, false);
        const formated_sortings = format_sortings(renamed_sortings);
        await this.props.filterEditableDatasets(
            pageSize || this.defaultPageSize,
            page,
            formated_sortings,
            formated_filters
        );
        this.setState({ loading: false });
    };

    // Navigate entirely to a route without filters (when clicking remove filters)
    removeFilters = async () => {
        this.setState({ filters: [], sortings: [] });
        await this.props.filterEditableDatasets(
            this.defaultPageSize,
            0,
            [],
            {}
        );
        this.setState({ loading: false });
    };

    // When a user sorts by any field, we want to preserve the filters:
    sortTable = async (sortings, page, pageSize) => {
        const { filters } = this.state;
        const renamed_filters = rename_triplets(filters, true);
        const formated_filters = format_filters(renamed_filters);
        const renamed_sortings = rename_triplets(sortings, false);
        const formated_sortings = format_sortings(renamed_sortings);
        await this.props.filterEditableDatasets(
            pageSize || this.defaultPageSize,
            page,
            formated_sortings,
            formated_filters
        );
        this.setState({ loading: false });
    };
    onPageChange = async page => {
        this.sortTable(this.state.sortings, page);
    };
    onPageSizeChange = async (newSize, page) => {
        this.defaultPageSize = newSize;
        this.sortTable(this.state.sortings, page, newSize);
    };

    render() {
        const {
            query: { section }
        } = this.props.router;
        const { filters, filterable, loading, show_state_columns } = this.state;
        const {
            workspace,
            workspaces,
            dataset_table,
            moveDataset,
            reGenerateCache,
            showManageDatasetModal,
            showLumisectionModal
        } = this.props;
        let { datasets, pages, count } = dataset_table;
        const filter_object = this.convertFiltersToObject(filters);

        let columns = column_generator({
            showManageDatasetModal,
            showLumisectionModal,
            workspace,
            workspaces,
            moveDataset,
            toggleShowFilters: this.toggleShowFilters,
            filter_object,
            reGenerateCache
        });

        if (show_state_columns) {
            columns = [
                columns[0],
                columns[1],
                columns[2],
                columns[3],
                ...generate_state_columns(),
                ...columns.slice(4)
            ];
        }
        // Filter is on if the array of filters is greater than 0
        const filter = filters.length > 0;
        return (
            <div>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div>
                        {section === 'cycles'
                            ? 'Datasets in cycle:'
                            : 'Editable datasets (already appeared in DQM GUI, or forcefully moved down):'}
                    </div>
                    <div>
                        <Button
                            onClick={() =>
                                this.props.showOfflineConfigurationModal(
                                    'export_to_csv'
                                )
                            }
                        >
                            Export to CSV
                        </Button>
                    </div>
                </div>
                {filter ? (
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
                            Filter/Sorting are ON (total datasets: {count})
                        </h3>
                        {'    -    '}
                        <a onClick={this.removeFilters}>
                            Click here to remove filters and sortings
                        </a>
                    </div>
                ) : (
                    <div style={{ height: '24px' }} />
                )}

                <ReactTable
                    columns={columns}
                    manual
                    pageSizeOptions={[5, 10, 20, 25, 50, 75, 100]}
                    data={
                        datasets // Forces table not to paginate or sort automatically, so we can handle it server-side
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
                        // 0 is for first page
                        this.sortTable(sortings, 0);
                    }}
                    filterable={filterable}
                    defaultPageSize={
                        this.defaultPageSize // Request new data when things change
                    }
                    className="-striped -highlight"
                />
                <br />
                <Button
                    onClick={() =>
                        this.setState({
                            show_state_columns: !show_state_columns
                        })
                    }
                >
                    {show_state_columns
                        ? 'Hide workspace state columns'
                        : 'Show workspace state columns'}
                </Button>
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
        dataset_table: state.offline.editable_datasets,
        workspaces: state.offline.workspace.workspaces,
        workspace: state.offline.workspace.workspace
    };
};

export default withRouter(
    connect(mapStateToProps, {
        filterEditableDatasets,
        showManageDatasetModal,
        showLumisectionModal,
        moveDataset,
        reGenerateCache,
        showOfflineConfigurationModal
    })(DatasetTable)
);
