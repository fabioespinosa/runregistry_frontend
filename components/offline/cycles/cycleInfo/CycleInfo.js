import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Card, Button } from 'antd';
import {
  markCycleComplete,
  moveCycleBackToPending,
  moveAllDatasetsInCycleTo,
} from '../../../../ducks/offline/cycles';

class CycleInfo extends Component {
  markCycleComplete = async () => {
    const { selected_cycle, workspace, markCycleComplete } = this.props;
    await markCycleComplete(selected_cycle.id_cycle, workspace);
    await Swal(
      `Cycle marked completed in workspace ${workspace}`,
      '',
      'success'
    );
  };

  moveCycleBackToPending = async () => {
    const { selected_cycle, workspace, moveCycleBackToPending } = this.props;
    await moveCycleBackToPending(selected_cycle.id_cycle, workspace);
    await Swal(`Cycle marked PENDING in workspace ${workspace}`, '', 'success');
  };

  moveAllDatasetsTo = async () => {
    const to_state = 'COMPLETED';
    const { selected_cycle, workspace, moveAllDatasetsInCycleTo } = this.props;
    await moveAllDatasetsInCycleTo(
      selected_cycle.id_cycle,
      workspace,
      to_state
    );
    await this.props.cycles_ref.current.displayCycle(selected_cycle);
    await Swal(
      `All datasets in cycle ${selected_cycle.id_cycle} moved to ${to_state}`,
      '',
      'success'
    );
  };

  render() {
    const { selected_cycle, workspace } = this.props;
    const cycle_state =
      selected_cycle.cycle_attributes[`${workspace.toLowerCase()}_state`];
    return (
      <Card
        style={{ backgroundColor: 'inherit' }}
        bodyStyle={{ padding: '10px' }}
      >
        <center>
          <h3>
            Showing Datasets from Cycle {selected_cycle.id_cycle} - Cycle name:{' '}
            <i>{selected_cycle.cycle_name}</i>
          </h3>
          Cycle created on:{' '}
          {moment(selected_cycle.createdAt).format('dddd, MMMM Do YYYY')}
          <br />
          <strong>
            Deadline of cycle:{' '}
            {moment(selected_cycle.deadline).format('dddd, MMMM Do YYYY')} at
            23:59
          </strong>
          <br />
          <br />
          {selected_cycle.datasets.length} dataset(s) in the cycle
          <br />
          {cycle_state === 'completed' ? (
            <div>
              <h2>This cycle is already completed.</h2>
              <Button onClick={this.moveCycleBackToPending}>
                Move cycle back to PENDING (in {workspace} workspace)
              </Button>
            </div>
          ) : (
            <Button onClick={this.markCycleComplete}>
              Mark this cycle as COMPLETED (in {workspace} workspace)
            </Button>
          )}
          <br />
          {cycle_state !== 'completed' && (
            <div>
              <Button onClick={this.moveAllDatasetsTo}>
                Move all datasets in this cycle to COMPLETED (in {workspace}{' '}
                workspace)
              </Button>
            </div>
          )}
        </center>
      </Card>
    );
  }
}

export default connect(null, {
  markCycleComplete,
  moveCycleBackToPending,
  moveAllDatasetsInCycleTo,
})(CycleInfo);
