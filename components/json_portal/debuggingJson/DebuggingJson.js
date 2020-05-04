import React, { Component } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import FilteredTable from '../filtered_table/FilteredTable';
import { filterEditableDatasets as filterDebuggingDatasets } from '../../../ducks/json/datasets';

class DebuggingJson extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    animateScroll.scrollToBottom();
  }

  render() {
    const {
      selected_json,
      filterDebuggingDatasets,
      debugging_datasets,
    } = this.props;
    return (
      <div>
        <h2>Debugging json</h2>
        <h3>
          Discover why a run/lumisection is included (or is not) in the
          generated json
        </h3>
        <div>
          <FilteredTable
            table_without_url_functionality={true}
            dataset_table={debugging_datasets}
            filterDatasets={(page_size, page, sortings, filter) =>
              filterDebuggingDatasets(
                page_size,
                page,
                sortings,
                filter,
                selected_json.generated_json_with_dataset_names
              )
            }
            defaultPageSize={20}
            table_label={`Debugging JSON ${selected_json.id}`}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    debugging_datasets: state.json.datasets,
  };
};
export default connect(mapStateToProps, { filterDebuggingDatasets })(
  DebuggingJson
);
