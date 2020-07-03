import React, { Component } from 'react';
import { connect } from 'react-redux';
import stringify from 'json-stringify-pretty-compact';

class GetAPICall extends Component {
  render() {
    const { count, filter, workspaces, workspace } = this.props;
    const stringified_filter = stringify(filter);
    return (
      <div>
        <h3>
          This tool will allow to get all the results that you get applying the
          filter on an API call using RR python API client
        </h3>
        <h5 style={{ textAlign: 'center', color: 'red' }}>
          {count} Datasets Selected
        </h5>
        <h5>
          {Object.keys(filter).length === 0
            ? `WARNING: NO FILTER, EXPORTING ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
            : `With filter: ${JSON.stringify(filter)}`}
        </h5>
        <pre>
          <code>
            {`
import runregistry from runregistry 

datasets = runregistry.get_datasets(
  filter=${stringified_filter}, 
  ignore_filter_transformation=True
)

`}
          </code>
        </pre>
        <br />

        <style jsx>{`
          .form_container {
            margin: 0 auto;
            width: 400px;
          }

          ul {
            list-style: none;
            margin-left: 20px;
          }

          .buttons {
            display: flex;
            justify-content: flex-end;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { count, filter } = state.offline.editable_datasets;
  return {
    count,
    filter,
    workspaces: state.offline.workspace.workspaces,
    workspace: state.offline.workspace.workspace,
  };
};

export default connect(mapStateToProps)(GetAPICall);
