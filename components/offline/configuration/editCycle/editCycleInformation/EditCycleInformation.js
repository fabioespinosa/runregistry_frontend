import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import { Input, Button, Checkbox, DatePicker } from 'antd';
import moment from 'moment';
import { editCycle } from '../../../../../ducks/offline/cycles';

class EditCycleInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_deadline: moment(this.props.selected_cycle.deadline),
    };
  }
  render() {
    const { new_deadline } = this.state;
    const { selected_cycle, workspaces, editCycle } = this.props;
    const { cycle_name, id_cycle, deadline, cycle_attributes } = selected_cycle;
    const initialValues = {
      cycle_name,
    };
    for (const [key, val] of Object.entries(cycle_attributes)) {
      initialValues[`workspaces-${key.split('_state')[0]}`] = true;
    }

    return (
      <div>
        Edit cycle information
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

            let new_cycle_attributes = {
              global_state: cycle_attributes[`global_state`],
            };
            workspaces.forEach((workspace) => {
              // If the cycle is selected and already existed in previous workspace:
              const previous_value = cycle_attributes[`${workspace}_state`];
              if (typeof previous_value !== 'undefined') {
                new_cycle_attributes[`${workspace}_state`] = previous_value;
              } else {
                new_cycle_attributes[`${workspace}_state`] = 'pending';
              }
            });

            // If the cycle was completed in a workspace, we don't delete it:
            for (const [key, val] of Object.entries(cycle_attributes)) {
              if (val === 'completed') {
                new_cycle_attributes[key] = val;
              }
            }

            const cycle = await editCycle({
              id_cycle,
              deadline: new_deadline,
              cycle_attributes: new_cycle_attributes,
              cycle_name,
            });
            this.props.hideConfigurationModal();
            await Swal(`Cycle ${cycle.id_cycle} modified`, '', 'success');
          }}
          render={({ values, setFieldValue, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className="dataset_copy_form">
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
                  <h3>
                    Workspaces cycle exists in (if the cycle is already marked
                    completed it will not be removed):
                  </h3>
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
                      value={new_deadline}
                      onChange={(new_deadline) =>
                        this.setState({ new_deadline })
                      }
                    />{' '}
                    <i>(Deadline is the date selected at 23:59)</i>
                  </div>
                </div>
                <br />
                <div>
                  <Button type="primary" htmlType="submit">
                    Edit cycle
                  </Button>
                </div>
              </form>
            );
          }}
        />
      </div>
    );
  }
}

export default connect(null, { editCycle })(EditCycleInformation);
