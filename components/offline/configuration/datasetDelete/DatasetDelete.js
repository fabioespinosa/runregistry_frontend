import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button, Select, Input, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
const { Option } = Select;

import { deleteDatasets } from '../../../../ducks/offline/dc_tools';

class DeleteDatasets extends Component {
  state = { unique_dataset_names: [] };
  componentDidMount = error_handler(async () => {
    const { filter, workspace } = this.props;
    const { data: unique_dataset_names } = await axios.post(
      `${api_url}/dc_tools/unique_dataset_names`,
      {
        workspace: workspace.toLowerCase(),
        filter
      }
    );
    this.setState({ unique_dataset_names });
  });
  render() {
    const { datasets, count, filter, workspaces, workspace } = this.props;
    const { unique_dataset_names } = this.state;
    const initialValues = {};
    if (workspace !== 'global') {
      return <h3>This action must be performed in the global workspace</h3>;
    }
    return (
      <div>
        <h3>
          This tool will allow the DC Expert to delete datasets for{' '}
          <strong>All</strong> workspaces)
        </h3>
        <h5 style={{ textAlign: 'center', color: 'red' }}>
          {count} Datasets Selected
        </h5>
        <h4>
          You cannot delete a single dataset, you must delete all datasets
          belonging to a certain dataset name (this will delete all datasets
          associated with that dataset name, for all workspaces, including those
          in waiting list)
        </h4>
        <h5>
          {Object.keys(filter).length === 0
            ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
            : `With filter: ${JSON.stringify(filter)}`}
        </h5>
        <br />
        <Formik
          initialValues={initialValues}
          onSubmit={async values => {
            if (
              values.reason_for_hiding &&
              values.reason_for_hiding.length < 1
            ) {
              // Error
            } else {
              await this.props.deleteDatasets(values);
              await Swal(`Datasets deleted`, '', 'success');
            }
          }}
          render={({ values, setFieldValue, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className="dataset_copy_form">
                <div className="form_container">
                  <br />
                  <br />
                  Delete all datasets from the following dataset name:
                  <Select
                    placeholder="Dataset name"
                    value={values['dataset_name']}
                    onChange={value => setFieldValue('dataset_name', value)}
                  >
                    {unique_dataset_names.map(dataset_name => (
                      <Option key={dataset_name} value={dataset_name}>
                        {dataset_name}
                      </Option>
                    ))}
                  </Select>
                  <br />
                  <br />
                  You must enter a reason to delete these datasets:
                  <Input
                    value={values['reason_for_hiding']}
                    onChange={evt =>
                      setFieldValue('reason_for_hiding', evt.target.value)
                    }
                    type="text"
                  />
                  <br />
                </div>
                <div className="buttons">
                  <Button type="primary" htmlType="submit">
                    Delete datasets
                  </Button>
                </div>
              </form>
            );
          }}
        />
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

const mapStateToProps = state => {
  const { datasets, count, filter } = state.offline.editable_datasets;
  return {
    datasets,
    count,
    filter,
    workspace: state.offline.workspace.workspace,
    workspaces: state.offline.workspace.workspaces
  };
};

export default connect(mapStateToProps, { deleteDatasets })(DeleteDatasets);
