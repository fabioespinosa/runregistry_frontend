import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { moveDataset, filterDatasets } from '../../../ducks/offline/datasets';
import {
    showManageDatasetModal,
    showLumisectionModal
} from '../../../ducks/offline/ui';
import format_filters from './filters/format_filters';
import format_sortings from './filters/format_sortings';
import rename_triplets from './filters/rename_triplets';

import ReactTable from 'react-table';
import column_generator from './columns/columns';

class DatasetTable extends Component {
    constructor(props) {
        super(props);
        this.defaultPageSize = props.defaultPageSize;
    }
    state = { filterable: false, filters: [], sortings: [], loading: false };
    toggleShowFilters = () =>
        this.setState({ filterable: !this.state.filterable });

    async componentDidMount() {
        this.setState({ loading: true });
        await this.props.filterDatasets(this.defaultPageSize, 0, [], {});
        this.setState({ loading: false });
    }

    // API understands a filter object, not a filter array:
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
        await this.props.filterDatasets(
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
        await this.props.filterDatasets(this.defaultPageSize, 0, [], filters);
    };

    // When a user sorts by any field, we want to preserve the filters:
    sortTable = async (sortings, page, pageSize) => {
        const { filters } = this.state;
        const renamed_filters = rename_triplets(filters, true);
        const formated_filters = format_filters(renamed_filters);
        const renamed_sortings = rename_triplets(sortings, false);
        const formated_sortings = format_sortings(renamed_sortings);
        await this.props.filterDatasets(
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
        const { filters, filterable, loading } = this.state;
        const {
            workspace,
            workspaces,
            dataset_table,
            moveDataset,
            showManageDatasetModal,
            showLumisectionModal
        } = this.props;
        let { datasets, pages } = dataset_table;
        const filter_object = this.convertFiltersToObject(filters);

        const columns = column_generator({
            showManageDatasetModal,
            showLumisectionModal,
            workspace,
            workspaces,
            moveDataset,
            toggleShowFilters: this.toggleShowFilters,
            filter_object
        });
        // Filter is on if the array of filters is greater than 0
        const filter = filters.length > 0;
        return (
            <div>
                Editable datasets (already appeared in DQM GUI, or forcefully
                moved down):
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
                            Filter/Sorting are ON
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
        dataset_table: state.offline.datasets,
        workspaces: state.offline.workspace.workspaces,
        workspace: state.offline.workspace.workspace
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        {
            filterDatasets,
            showManageDatasetModal,
            showLumisectionModal,
            moveDataset
        }
    )(DatasetTable)
);
