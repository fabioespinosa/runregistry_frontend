import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import {
  moveDataset,
  filterWaitingDatasets
} from '../../../ducks/offline/datasets';
import { showManageDatasetModal } from '../../../ducks/offline/ui';
import { showLumisectionModal } from '../../../ducks/global_ui';
import format_filters from '../../common/CommonTableComponents/FilteringAndSorting/format_filters';
import format_sortings from '../../common/CommonTableComponents/FilteringAndSorting/format_sortings';
import rename_triplets from '../../common/CommonTableComponents/FilteringAndSorting/rename_triplets';

import ReactTable from 'react-table';
import column_generator from './columns/columns';

class DatasetTable extends Component {
  constructor(props) {
    super(props);
    this.defaultPageSize = props.defaultPageSize;
  }
  state = { filterable: true, filters: [], sortings: [], loading: false };
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
      await this.props.filterWaitingDatasets(this.defaultPageSize, 0, [], {});
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
    if (
      section !== 'cycles' &&
      (previous_query.section !== section ||
        previous_query.workspace !== workspace)
    ) {
      this.setState({ loading: true });
      await this.props.filterWaitingDatasets(this.defaultPageSize, 0, [], {});
      this.setState({ loading: false });
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
    try {
      this.setState({ filters, loading: true });
      const { sortings } = this.state;
      const renamed_filters = rename_triplets(filters, true);
      const formated_filters = format_filters(renamed_filters);
      const renamed_sortings = rename_triplets(sortings, false);
      const formated_sortings = format_sortings(renamed_sortings);
      await this.props.filterWaitingDatasets(
        pageSize || this.defaultPageSize,
        page,
        formated_sortings,
        formated_filters
      );
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  // Navigate entirely to a route without filters (when clicking remove filters)
  removeFilters = async () => {
    this.setState({ filters: [], sortings: [] });
    await this.props.filterWaitingDatasets(this.defaultPageSize, 0, [], {});
    this.setState({ loading: false });
  };

  // When a user sorts by any field, we want to preserve the filters:
  sortTable = async (sortings, page, pageSize) => {
    const { filters } = this.state;
    const renamed_filters = rename_triplets(filters, true);
    const formated_filters = format_filters(renamed_filters);
    const renamed_sortings = rename_triplets(sortings, false);
    const formated_sortings = format_sortings(renamed_sortings);
    await this.props.filterWaitingDatasets(
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

    let { datasets, pages, count } = dataset_table;
    const filter_object = this.convertFiltersToObject(filters);

    const columns = column_generator({
      showManageDatasetModal,
      showLumisectionModal,
      workspaces,
      workspace,
      moveDataset,
      toggleShowFilters: this.toggleShowFilters,
      filter_object
    });
    // Filter is on if the array of filters is greater than 0
    const filter = filters.length > 0;
    return (
      <div>
        Datasets waiting to appear in DQM GUI ({filter && 'with filter:'}
        {count}):
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
    dataset_table: state.offline.waiting_datasets,
    workspaces: state.offline.workspace.workspaces,
    workspace: state.offline.workspace.workspace
  };
};

export default withRouter(
  connect(mapStateToProps, {
    filterWaitingDatasets,
    showManageDatasetModal,
    showLumisectionModal,
    moveDataset
  })(DatasetTable)
);
