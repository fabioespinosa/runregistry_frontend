import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Card, Button } from 'antd';
import { markCycleComplete } from '../../../../ducks/offline/cycles';

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

    render() {
        const { selected_cycle, workspace } = this.props;
        return (
            <Card
                style={{ backgroundColor: 'inherit' }}
                bodyStyle={{ padding: '10px' }}
            >
                <center>
                    <h3>
                        Showing Datasets from Cycle {selected_cycle.id_cycle}{' '}
                    </h3>
                    Cycle created in:{' '}
                    {moment(selected_cycle.createdAt).format(
                        'dddd, MMMM Do YYYY'
                    )}
                    {', '}
                    <strong>
                        Deadline of cycle:{' '}
                        {moment(selected_cycle.deadline).format(
                            'dddd, MMMM Do YYYY'
                        )}
                    </strong>
                    <br />
                    <br />
                    {selected_cycle.Runs.length} run(s) in the cycle:{' '}
                    {selected_cycle.Runs.map(
                        ({ run_number }) => run_number
                    ).toString()}
                    <br />
                    {selected_cycle.cycle_attributes[
                        `${workspace.toLowerCase()}_state`
                    ] === 'completed' ? (
                        'Cycle marked as completed'
                    ) : (
                        <Button onClick={this.markCycleComplete}>
                            Mark this cycle as complete
                        </Button>
                    )}
                </center>
            </Card>
        );
    }
}

export default connect(
    null,
    { markCycleComplete }
)(CycleInfo);
