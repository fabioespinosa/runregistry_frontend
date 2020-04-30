import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { DatePicker, Button, Checkbox, Input, Select } from 'antd';
import moment from 'moment';
import { api_url } from '../../../../config/config';
import { editCycle } from '../../../../ducks/offline/cycles';
import { error_handler } from '../../../../utils/error_handlers';
import { hideConfigurationModal } from '../../../../ducks/offline/ui';
import AddDatasetsToCycle from './addDatasetsToCycle/AddDatasetsToCycle';
import DeleteDatasetsFromCycle from './deleteDatasetsFromCycle/DeleteDatasetsFromCycle';
import EditCycleInformation from './editCycleInformation/EditCycleInformation';
const { Option } = Select;

class EditCycle extends Component {
  state = {
    deadline: moment(),
    cycles: [],
    selected_cycle_id: undefined,
  };

  componentDidMount() {
    this.fetchCycles();
  }

  fetchCycles = error_handler(async () => {
    const { data: cycles } = await axios.get(`${api_url}/cycles/global`);
    this.setState({ cycles });
  });

  onCycleEdited = () => {
    this.setState({ selected_cycle_id: undefined });
    this.fetchCycles();
  };

  render() {
    const {
      router: {
        query: { section },
      },
    } = this.props;

    if (section === 'cycles') {
      return (
        <h4>
          Editing a cycle can only be done in the datasets view, not in the
          cycles view
        </h4>
      );
    }

    const {
      datasets,
      count,
      filter,
      workspaces,
      editCycle,
      hideConfigurationModal,
    } = this.props;
    const { deadline, cycles, selected_cycle_id, editing_type } = this.state;
    let selected_cycle;
    if (typeof selected_cycle_id !== 'undefined') {
      selected_cycle = cycles.find(
        (cycle) => cycle.id_cycle === selected_cycle_id
      );
    }
    const initialValues = {};
    // By default all workspaces start being true:
    workspaces.forEach(({ workspace }) => {
      initialValues[`workspaces-${workspace}`] = true;
    });
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h3>Edit cycle</h3>
          <div>Select a cycle from the cycle list:</div>
          <Select
            placeholder="Select cycle"
            value={selected_cycle_id}
            onChange={(selected_cycle_id) =>
              this.setState({ selected_cycle_id })
            }
          >
            {cycles.map(({ id_cycle, cycle_name }) => (
              <Option value={id_cycle}>
                id: {id_cycle} - name: {cycle_name}
              </Option>
            ))}
          </Select>
        </div>
        <br />
        {typeof selected_cycle_id !== 'undefined' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              margin: '0 auto',
            }}
          >
            <div className="container_button">
              <Button
                onClick={() => this.setState({ editing_type: 'information' })}
              >
                Edit cycle information
              </Button>
            </div>
            <div className="container_button">
              <Button
                onClick={() => this.setState({ editing_type: 'add_datasets' })}
              >
                Add datasets to cycle
              </Button>
            </div>
            <div className="container_button">
              <Button
                onClick={() =>
                  this.setState({ editing_type: 'delete_datasets' })
                }
              >
                Delete datasets from cycle
              </Button>
            </div>
          </div>
        )}
        <br />
        <div style={{ marginLeft: '10px' }}>
          {editing_type === 'information' ? (
            <EditCycleInformation
              selected_cycle={selected_cycle}
              workspaces={workspaces}
              onCycleEdited={this.onCycleEdited}
              hideConfigurationModal={hideConfigurationModal}
            />
          ) : editing_type === 'add_datasets' ? (
            <AddDatasetsToCycle
              datasets={datasets}
              filter={filter}
              count={count}
              selected_cycle={selected_cycle}
              hideConfigurationModal={hideConfigurationModal}
            />
          ) : editing_type === 'delete_datasets' ? (
            <DeleteDatasetsFromCycle
              datasets={datasets}
              filter={filter}
              count={count}
              selected_cycle={selected_cycle}
              hideConfigurationModal={hideConfigurationModal}
            />
          ) : (
            <div>Select an option above</div>
          )}
        </div>
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
    workspaces: state.offline.workspace.workspaces,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    editCycle,
    hideConfigurationModal,
  })(EditCycle)
);
