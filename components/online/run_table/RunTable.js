import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import qs from 'qs';
import format_filters from '../../common/CommonTableComponents/FilteringAndSorting/format_filters';
import format_sortings from '../../common/CommonTableComponents/FilteringAndSorting/format_sortings';
import rename_triplets from '../../common/CommonTableComponents/FilteringAndSorting/rename_triplets';
import {
  moveRun,
  markSignificant,
  filterRuns
} from '../../../ducks/online/runs';
import {
  showManageRunModal,
  showClassifierVisualizationModal
} from '../../../ducks/online/ui';
import { showLumisectionModal } from '../../../ducks/global_ui';

import ReactTable from 'react-table';
import column_generator from './columns/columns';
const Filter = dynamic(import('./filter/Filter'), {
  ssr: false
});

// When user enters URL with filter, we only show one table (the one which contains all runs)
// If a user filters with the SignificantRunTable then the url will also include the filter of significance

const table_columns = [
  { name: 'run_number', label: 'run_number' },
  { name: 'rr_attributes.class', label: 'class' },
  { name: 'rr_attributes.significant', label: 'significant' },
  { name: 'rr_attributes.state', label: 'state' },
  { name: 'oms_attributes.start_time', label: 'start_time' },
  { name: 'oms_attributes.ls_duration', label: 'ls_duration' },
  { name: 'oms_attributes.b_field', label: 'b_field' },
  { name: 'oms_attributes.clock_type', label: 'clock_type' }
];

const online_columns = [];

const valueProcessor = ({ field, operator, value }) => {
  if (field === 'run_number' && operator === '=' && value === '') {
    value = null;
  }
  if (field === 'run_number' && operator === 'in') {
    // Handle the case where there are lots of run numbers in the text field:
    value = value.replace(/,/g, ''); // Replace commas for spaces, useful for input of runs in syntax: 325334, 234563
    value = value.trim().replace(/ +/g, ' '); // Replace more than one space for 1 space
    const run_numbers = value.split(' ').filter(arg => arg !== ''); // Split per space
    return {
      combinator: 'or',
      not: false,
      rules: run_numbers.map(run_number => {
        return {
          field: 'run_number',
          operator: '=',
          value: run_number
        };
      })
    };
  }
  if (field.startsWith('triplet_summary')) {
    value = value || 'GOOD';
    field = `${field}.${value}`;
    operator = '>';
    value = 0;
  }
  if (field === 'oms_attributes.ls_duration') {
    value = parseInt(value);
  }
  return { field, operator, value };
};

class RunTable extends Component {
  constructor(props) {
    super(props);
    this.defaultPageSize = props.defaultPageSize;
    let sortings = [];
    const { filters } = this.props.router.query;
    if (filters) {
      const query_sortings = filters['top_sortings'];
      if (query_sortings) {
        sortings = query_sortings;
      }
    }
    this.state = { filters: {}, sortings, loading: true };
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
      this.setState({ filters: {}, sortings: [] });
    }
  }

  // When a user filters the table, it goes and applies the filters to the url, then it filters the runs
  filterTable = async (filters, page, pageSize) => {
    this.setState({ filters, loading: true });
    const { sortings } = this.state;
    const renamed_sortings = rename_triplets(sortings, false);
    const formated_sortings = format_sortings(renamed_sortings);
    try {
      await this.props.filterRuns(
        pageSize || this.defaultPageSize,
        page,
        formated_sortings,
        filters
      );
    } catch (e) {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  };

  // Remove filters
  removeFilters = async () => {
    window.location.href = window.location.href.split('?')[0];
  };

  setSortingsOnUrl = sortings => {
    const { filters } = this.props.router.query;
    let { asPath } = this.props.router;

    if (asPath.includes('?')) {
      asPath = asPath.split('?')[0];
    }
    let url_query = qs.stringify({
      ...filters,
      ['top_sortings']: sortings
    });
    if (sortings.length === 0) {
      const new_filter = { ...filters };
      delete new_filter['top_sortings'];
      url_query = qs.stringify(new_filter);
    }
    history.pushState({}, '', `${asPath}?${url_query}`);
  };

  // When a user sorts by any field, we want to preserve the filters:
  sortTable = async (sortings, page, pageSize) => {
    this.setState({ sortings, loading: true });
    this.setSortingsOnUrl(sortings);
    const { filters } = this.state;
    const renamed_sortings = rename_triplets(sortings, false);
    const formated_sortings = format_sortings(renamed_sortings);
    try {
      await this.props.filterRuns(
        pageSize || this.defaultPageSize,
        page,
        formated_sortings,
        filters
      );
    } catch (e) {
      this.setState({ loading: false });
    }
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
    const { filters, sortings, loading } = this.state;
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
    const columns = column_generator({
      showManageRunModal,
      showClassifierVisualizationModal,
      showLumisectionModal,
      moveRun,
      significant_runs: false,
      toggleShowFilters: this.toggleShowFilters,
      markSignificant,
      workspace,
      workspaces
    });
    // Filter is on if the array of filters is greater than 0
    const filter = filters.and && filters.and.length > 0;
    return (
      <div>
        {filter ? 'Runs with filter ' : 'All runs '} ({count}):{' '}
        {filter && (
          <a onClick={this.removeFilters}>
            &nbsp; Click here to remove all filters and sortings from this table
          </a>
        )}
        <Filter
          table_columns={columns
            .filter(({ accessor }) => !!accessor)
            .map(({ prefix_for_filtering: prefix, id }) => ({
              name: `${prefix}${prefix && '.'}${id}`,
              label: id
            }))}
          key={workspace}
          other_columns={online_columns}
          filterTable={this.filterTable}
          valueProcessor={valueProcessor}
          prefix_from_url="top"
          setParentLoading={loading => this.setState({ loading })}
        />
        <ReactTable
          columns={columns}
          sorted={sortings}
          manual
          pageSizeOptions={[5, 10, 12, 20, 25, 50, 75, 100]}
          data={
            runs // Forces table not to paginate or sort automatically, so we can handle it server-side
          }
          pages={pages}
          loading={loading}
          onPageChange={page => {
            this.onPageChange(page);
          }}
          onPageSizeChange={(pageSize, page) =>
            this.onPageSizeChange(pageSize, page)
          }
          // onFilteredChange={(filtered, column, table) => {
          //   // 0 is for first page
          //   this.filterTable(filtered, 0);
          // }}
          onSortedChange={sortings => {
            // 0 is for first page
            this.sortTable(sortings, 0);
          }}
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
    run_table: state.online.runs,
    workspaces: state.online.workspace.workspaces,
    workspace: state.online.workspace.workspace
  };
};

export default withRouter(
  connect(mapStateToProps, {
    filterRuns,
    showManageRunModal,
    showLumisectionModal,
    showClassifierVisualizationModal,
    moveRun,
    markSignificant
  })(RunTable)
);
