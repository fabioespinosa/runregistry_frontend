import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Card, Button } from 'antd';
import {
  markCycleComplete,
  moveCycleBackToPending
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

  render() {
    const { selected_cycle, workspace } = this.props;
    return (
      <Card
        style={{ backgroundColor: 'inherit' }}
        bodyStyle={{ padding: '10px' }}
      >
        <center>
          <h3>Showing Datasets from Cycle {selected_cycle.id_cycle} </h3>
          Cycle created on:{' '}
          {moment(selected_cycle.createdAt).format('dddd, MMMM Do YYYY')}
          {', '}
          <strong>
            Deadline of cycle:{' '}
            {moment(selected_cycle.deadline).format('dddd, MMMM Do YYYY')}
          </strong>
          <br />
          <br />
          {selected_cycle.datasets.length} dataset(s) in the cycle
          <br />
          {selected_cycle.cycle_attributes[
            `${workspace.toLowerCase()}_state`
          ] === 'completed' ? (
            <div>
              <h2>This cycle is already completed.</h2>
              <Button onClick={this.moveCycleBackToPending}>
                Move cycle back to PENDING
              </Button>
            </div>
          ) : (
            <Button onClick={this.markCycleComplete}>
              Mark this cycle as COMPLETED
            </Button>
          )}
        </center>
      </Card>
    );
  }
}

export default connect(null, {
  markCycleComplete,
  moveCycleBackToPending
})(CycleInfo);
