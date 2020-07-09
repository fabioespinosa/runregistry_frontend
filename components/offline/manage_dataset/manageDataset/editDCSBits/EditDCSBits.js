import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Select, Input, Button, Spin } from 'antd';
import axios from 'axios';

import EditComponent from '../../../../common/editComponent/EditComponent';
import {
  api_url,
  certifiable_offline_components,
  lumisection_attributes,
} from '../../../../../config/config';
import { addOMSLumisectionRange } from '../../../../../ducks/online/lumisections';
import { error_handler } from '../../../../../utils/error_handlers';

class EditDCSBits extends Component {
  state = {
    lumisections: {},
    loading: true,
  };
  componentDidMount() {
    this.fetchLumisections();
  }

  fetchLumisections = error_handler(async () => {
    this.setState({ lumisections: {}, loading: true });
    const { name, run_number } = this.props.dataset;
    const { data: lumisections } = await axios.post(
      `${api_url}/lumisections/oms_lumisection_ranges_by_dcs_bit`,
      {
        dataset_name: name,
        run_number: run_number,
      }
    );
    this.setState({ lumisections, loading: false });
  });
  render() {
    const { dataset, workspaces, addOMSLumisectionRange } = this.props;
    const current_workspace = this.props.workspace.toLowerCase();
    return (
      <div>
        {dataset[`${current_workspace}_state`] !== 'waiting dqm gui' ? (
          <div style={{ overflowX: 'scroll' }}>
            <br />
            <center>
              <h1>Editing DCS bits is reserved for the DC team only</h1>
              <h2>
                This feature should only be used to RECOVER ls bits, bits we
                thought were BAD and are actually good
              </h2>
              <h3>
                In order for a lumisection to be considered GOOD it must be good
                for the corresponding DCS bit AND the corresponding RR bit
              </h3>
            </center>
            <table className="edit_run_form">
              <thead>
                <tr className="table_header">
                  <td>DCS bit</td>
                  <td>Comment</td>
                  <td>Modify</td>
                  <td>History</td>
                </tr>
              </thead>
              <tbody>
                {lumisection_attributes.map((dcs_bit) => {
                  if (this.state.loading) {
                    return (
                      <tr key={dcs_bit}>
                        <td>{dcs_bit}</td>
                        <td className="comment">
                          <Spin size="large" />
                        </td>
                        <td className="modify_toggle" />
                        <td></td>
                      </tr>
                    );
                  } else if (Object.keys(this.state.lumisections).length > 0) {
                    return (
                      <EditComponent
                        hide_cause={true}
                        boolean_statuses={true}
                        show_oms_history={true}
                        component_name={dcs_bit}
                        key={dcs_bit}
                        state={dataset[`${current_workspace}_state`]}
                        run_number={dataset.run_number}
                        dataset_name={dataset.name}
                        refreshLumisections={this.fetchLumisections}
                        component={dcs_bit}
                        lumisection_ranges={this.state.lumisections[dcs_bit]}
                        addLumisectionRange={addOMSLumisectionRange}
                      />
                    );
                  } else {
                    return (
                      <tr key={dcs_bit}>
                        <td>{dcs_bit}</td>
                        <td className="comment">No lumisection data</td>
                        <td className="modify_toggle" />
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            In order to edit a dataset's lumisections the dataset{' '}
            <i style={{ textDecoration: 'underline' }}>
              must appear in DQM GUI first
            </i>
            . <br /> <br />
            You can overwrite this by clicking 'move' (directly in the table)
            <br />
            <br />
            This is an automatic process and every 5 minutes, DQM GUI is checked
            to see if the dataset is already there.
          </div>
        )}
        <style jsx>{`
          .edit_run_form {
            margin: 0 auto;
            text-align: center;
            border: 1px solid grey;
          }
          thead {
            border-bottom: 3px solid grey;
            text-align: center;
          }
          tr > td {
            padding: 8px 5px;
          }
          tr:not(:last-child) {
            border-bottom: 1px solid grey;
          }

          tr > td :not(:last-child) {
            border-right: 0.5px solid grey;
          }

          th {
            text-align: center;
          }

          th > td:not(:last-child) {
            border-right: 0.5px solid grey;
            padding-right: 5px;
          }
          .comment {
            width: 400px;
          }
          .lumisection_slider {
            width: 200px;
          }
          .modify_toggle {
            width: 180px;
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
  return {
    workspace: state.offline.workspace.workspace,
    workspaces: state.offline.workspace.workspaces,
  };
};

export default connect(mapStateToProps, { addOMSLumisectionRange })(
  EditDCSBits
);
