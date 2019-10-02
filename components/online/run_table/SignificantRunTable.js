import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import format_filters from '../../common/CommonTableComponents/FilteringAndSorting/format_filters';
import format_sortings from '../../common/CommonTableComponents/FilteringAndSorting/format_sortings';
import rename_triplets from '../../common/CommonTableComponents/FilteringAndSorting/rename_triplets';
import { filterRuns } from '../../../ducks/online/significant_runs';
import { moveRun, markSignificant } from '../../../ducks/online/runs';
import {
    showManageRunModal,
    showClassifierVisualizationModal
} from '../../../ducks/online/ui';

import { showLumisectionModal } from '../../../ducks/global_ui';

import ReactTable from 'react-table';
import column_generator from './columns/columns';

class RunTable extends Component {
    constructor(props) {
        super(props);
        this.defaultPageSize = props.defaultPageSize;
    }

    state = { filterable: true, filters: [], sortings: [], loading: false };

    toggleShowFilters = () =>
        this.setState({ filterable: !this.state.filterable });
    // First time page loads, table grabs filter from query url, then goes and queries them:
    async componentDidMount() {
        this.setState({ loading: true });
        await this.props.filterRuns(this.defaultPageSize, 0, [], {});
        this.setState({ loading: false });
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
            previous_query.section !== section ||
            previous_query.workspace !== workspace
        ) {
            console.log(this.state);
            console.log('navigates');
            this.setState({ loading: true, filters: [], sortings: [] });
            await this.props.filterRuns(this.defaultPageSize, 0, [], {});
            this.setState({ loading: false });
            console.log(this.state);
        }
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
        await this.props.filterRuns(
            pageSize || this.defaultPageSize,
            page,
            formated_sortings,
            formated_filters
        );
        this.setState({ loading: false });
    };

    // Remove filters
    removeFilters = async () => {
        this.setState({ filters: [], sortings: [], loading: true });
        await this.props.filterRuns(this.defaultPageSize, 0, [], {});
        this.setState({ loading: false });
    };

    // When a user sorts by any field, we want to preserve the filters:
    sortTable = async (sortings, page, pageSize) => {
        this.setState({ sortings: sortings });
        const { filters } = this.state;
        const renamed_filters = rename_triplets(filters, true);
        const formated_filters = format_filters(renamed_filters);
        const renamed_sortings = rename_triplets(sortings, false);
        const formated_sortings = format_sortings(renamed_sortings);
        await this.props.filterRuns(
            pageSize || this.defaultPageSize,
            page,
            formated_sortings,
            formated_filters
        );
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
            run_table,
            moveRun,
            showManageRunModal,
            showLumisectionModal,
            showClassifierVisualizationModal,
            markSignificant,
            workspace,
            workspaces
        } = this.props;
        const { runs, pages, count } = run_table;
        const filter_object = this.convertFiltersToObject(filters);
        const columns = column_generator({
            showManageRunModal,
            showClassifierVisualizationModal,
            showLumisectionModal,
            moveRun,
            significant_runs: true,
            toggleShowFilters: this.toggleShowFilters,
            filterable,
            markSignificant,
            filter_object,
            workspace,
            workspaces
        });
        // Filter is on if the array of filters is greater than 0
        const filter = filters.length > 0;
        return (
            <div>
                Significant runs ({filter && 'with filter:'} {count}):
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
                            Filter/Sorting are ON (total runs: {count})
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
                    pageSizeOptions={[5, 10, 12, 20, 25, 50, 75, 100]}
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
        run_table: state.online.significant_runs,
        workspace: state.online.workspace.workspace,
        workspaces: state.online.workspace.workspaces
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        {
            filterRuns,
            showManageRunModal,
            showLumisectionModal,
            showClassifierVisualizationModal,
            moveRun,
            markSignificant
        }
    )(RunTable)
);
