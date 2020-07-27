import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button, Select, Input, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
const { Option } = Select;

import { datasetUpdate } from '../../../../ducks/offline/dc_tools';

class DatasetUpdate extends Component {
  state = {
    unique_dataset_names: [],
    loading_datasets: true,
    loading_submit: false,
  };
  componentDidMount = error_handler(async () => {
    const { filter, workspace } = this.props;
    const { data: unique_dataset_names } = await axios.post(
      `${api_url}/dc_tools/unique_dataset_names`,
      {
        workspace: workspace.toLowerCase(),
        filter,
      }
    );
    this.setState({ unique_dataset_names, loading_datasets: false });
  });
  render() {
    const {
      datasets,
      count,
      filter,
      workspace,
      router: {
        query: { section },
      },
    } = this.props;
    if (section === 'cycles') {
      return (
        <div>
          <h3>
            For moving dataset state in batch use the normal view (by clicking
            "Show All Datasets"), in the cycles view you can only move all at
            once using the button "Move all datasets in this cycle to COMPLETED"
          </h3>
        </div>
      );
    }

    const {
      unique_dataset_names,
      loading_datasets,
      loading_submit,
    } = this.state;
    const initialValues = {};
    return (
      <div>
        <h3>
          This tool will allow the DC Expert (or certificator admin) to change
          the dataset state for several datasets
        </h3>
        <h5 style={{ textAlign: 'center', color: 'red' }}>
          {count} Datasets Selected
        </h5>
        {section !== 'cycles' && (
          <h5>
            {Object.keys(filter).length === 0
              ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
              : `With filter: ${JSON.stringify(filter)}`}
          </h5>
        )}
        <br />
        <br />

        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              this.setState({ loading_submit: true });
              await this.props.datasetUpdate(values);
              this.setState({ loading_submit: false });
              await Swal(`Datasets state changed`, '', 'success');
            } catch (err) {
              this.setState({ loading_submit: false });
              throw err;
            }
          }}
          render={({ values, setFieldValue, handleSubmit }) => {
            console.log(values);
            return (
              <form onSubmit={handleSubmit} className="dataset_update_form">
                <div className="form_container">
                  <hr />
                  <br />
                  <p>How to use this tool?</p>
                  <p>
                    First make a filter of the datasets you want to change
                    states in batch in the lower table in Offline Run Registry.
                    Once that is done, go to this menu and you will have to
                    select a dataset name from that selection below and the
                    transition of states you want to make.
                  </p>
                  <hr />
                  <br />
                  Source dataset name: {'  '}
                  {loading_datasets ? (
                    'Loading datasets...'
                  ) : (
                    <Select
                      placeholder="Source dataset name"
                      value={values['source_dataset_name']}
                      onChange={(value) =>
                        setFieldValue('source_dataset_name', value)
                      }
                      className="big_select"
                    >
                      {unique_dataset_names.map((dataset_name) => (
                        <Option value={dataset_name}>{dataset_name}</Option>
                      ))}
                    </Select>
                  )}
                  <br />
                  <br />
                  Out of the datasets selected and those which matched the
                  source dataset name selected above, you want to change those
                  that are in state:{'  '}
                  <Select
                    placeholder="State from"
                    value={values['from_state']}
                    onChange={(value) => setFieldValue('from_state', value)}
                  >
                    <Option value="OPEN">OPEN</Option>
                    <Option value="COMPLETED">COMPLETED</Option>
                    <Option value="SIGNOFF">SIGNOFF</Option>
                  </Select>{' '}
                  to state: {'  '}
                  <Select
                    placeholder="Change state to"
                    value={values['to_state']}
                    onChange={(value) => setFieldValue('to_state', value)}
                  >
                    <Option value="COMPLETED">COMPLETED</Option>
                    <Option value="OPEN">OPEN</Option>
                    <Option value="SIGNOFF">SIGNOFF</Option>
                  </Select>
                  <br />
                  <br />
                  This change will take effect in the{' '}
                  <strong>{workspace}</strong> Workspace.{' '}
                  <i>
                    (If you want to change states in batch in a different
                    workspace, please open this tool in the respective
                    workspace)
                  </i>
                  <br />
                  <br />
                  <Checkbox
                    checked={values['change_in_all_workspaces']}
                    onChange={({ target }) =>
                      setFieldValue(`change_in_all_workspaces`, target.checked)
                    }
                  >
                    Change in all workspaces
                  </Checkbox>
                  <br />
                  <div className="buttons">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading_submit}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            );
          }}
        />
        <style jsx global>{`
          .big_select {
            width: 400px;
          }
        `}</style>
        <style jsx>{`
          .form_container {
            margin: 0 auto;
            width: 900px;
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
  const { datasets, count, filter } = state.offline.editable_datasets;
  return {
    datasets,
    count,
    filter,
    workspace: state.offline.workspace.workspace,
  };
};

export default withRouter(
  connect(mapStateToProps, { datasetUpdate })(DatasetUpdate)
);
