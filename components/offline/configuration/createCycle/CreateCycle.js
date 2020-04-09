import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { DatePicker, Button, Checkbox, Input } from 'antd';
import Swal from 'sweetalert2';
import moment from 'moment';
import { createCycle } from '../../../../ducks/offline/cycles';
import { hideConfigurationModal } from '../../../../ducks/offline/ui';

class CreateCycle extends Component {
  state = {
    deadline: moment(),
  };

  render() {
    const {
      datasets,
      count,
      filter,
      workspaces,
      createCycle,
      hideConfigurationModal,
    } = this.props;
    const { deadline } = this.state;

    const initialValues = {};
    // By default all workspaces start being true:
    workspaces.forEach(({ workspace }) => {
      initialValues[`workspaces-${workspace}`] = true;
    });
    return (
      <div>
        <h3>Add datasets to cycle</h3>
        <div style={{ display: 'flex' }}>
          <div style={{ marginLeft: '10px' }}>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values) => {
                // TODO: validation (empty fields, ...)
                const { cycle_name } = values;
                const workspaces = [];
                for (const [key, val] of Object.entries(values)) {
                  if (key.includes('workspaces-')) {
                    const workspace = key.split('workspaces-')[1];
                    if (val) {
                      workspaces.push(workspace);
                    }
                  }
                }

                const cycle_attributes = { global_state: 'pending' };
                workspaces.forEach(({ workspace }) => {
                  cycle_attributes[`${workspace}_state`] = 'pending';
                });

                const cycle = await createCycle({
                  deadline,
                  cycle_attributes,
                  cycle_name,
                });
                hideConfigurationModal();
                await Swal(`Cycle ${cycle.id_cycle} created`, '', 'success');
              }}
              render={({ values, setFieldValue, handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit} className="dataset_copy_form">
                    <h5
                      style={{
                        textAlign: 'center',
                        color: 'red',
                      }}
                    >
                      {count} Datasets Selected
                    </h5>
                    <h5>
                      {Object.keys(filter).length === 0
                        ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
                        : `With filter: ${JSON.stringify(filter)}`}
                    </h5>
                    <br />
                    Datasets Selected (showing a sample):
                    <ul>
                      {datasets.map(({ run_number, name }) => (
                        <li key={`${run_number}-${name}`}>
                          Name: <strong>{name}</strong>, Run number:{' '}
                          <strong>{run_number}</strong>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <div className="form_container">
                      <h3>Name of the cycle:</h3>
                      <Input
                        value={values['cycle_name']}
                        onChange={({ target }) =>
                          setFieldValue('cycle_name', target.value)
                        }
                        type="text"
                      />
                      <br />
                      <h3>Workspaces to create cycle in:</h3>
                      <ul>
                        {workspaces.map(({ workspace }) => (
                          <li key={workspace}>
                            <Checkbox
                              checked={values[`workspaces-${workspace}`]}
                              onChange={({ target }) =>
                                setFieldValue(
                                  `workspaces-${workspace}`,
                                  target.checked
                                )
                              }
                            >
                              {workspace}
                            </Checkbox>
                          </li>
                        ))}
                      </ul>
                      <div>
                        Deadline of cycle:{' '}
                        <DatePicker
                          value={deadline}
                          onChange={(new_deadline) =>
                            this.setState({
                              deadline: new_deadline,
                            })
                          }
                        />{' '}
                        <i>(Deadline is the date selected at 23:59)</i>
                      </div>
                    </div>
                    <br />
                    <div>
                      <Button type="primary" htmlType="submit">
                        Create new cycle
                      </Button>
                    </div>
                  </form>
                );
              }}
            />
          </div>
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

export default connect(mapStateToProps, {
  createCycle,
  hideConfigurationModal,
})(CreateCycle);
