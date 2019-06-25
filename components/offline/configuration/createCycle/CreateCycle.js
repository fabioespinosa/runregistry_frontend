import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { DatePicker, Button } from 'antd';
import Swal from 'sweetalert2';
import moment from 'moment';
import { api_url } from '../../../../config/config';
import { createCycle } from '../../../../ducks/offline/cycles';
import { hideConfigurationModal } from '../../../../ducks/offline/ui';

class CreateCycle extends Component {
    state = {
        deadline: moment()
    };

    createNewCycle = async () => {
        const { workspaces, createCycle, hideConfigurationModal } = this.props;
        const { deadline } = this.state;

        const cycle_attributes = { global_state: 'pending' };
        workspaces.forEach(({ workspace }) => {
            cycle_attributes[`${workspace}_state`] = 'pending';
        });

        await createCycle({
            deadline,
            cycle_attributes
        });
        hideConfigurationModal();
        await Swal(`Cycle created`, '', 'success');
    };

    render() {
        const { datasets, count, filter, workspaces } = this.props;

        return (
            <div>
                <h3>Add datasets to cycle</h3>
                <br />
                <div style={{ display: 'flex' }}>
                    <div style={{ marginLeft: '10px' }}>
                        <h5
                            style={{
                                textAlign: 'center',
                                color: 'red'
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
                        <br />
                        <div>
                            Deadline of cycle:{' '}
                            <DatePicker
                                value={this.state.deadline}
                                onChange={new_deadline =>
                                    this.setState({
                                        deadline: new_deadline
                                    })
                                }
                            />
                        </div>
                        <br />
                        <div>
                            <Button
                                type="primary"
                                onClick={this.createNewCycle}
                            >
                                Create new cycle
                            </Button>
                        </div>
                    </div>
                </div>
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
        workspaces: state.offline.workspace.workspaces
    };
};

export default connect(
    mapStateToProps,
    { createCycle, hideConfigurationModal }
)(CreateCycle);
