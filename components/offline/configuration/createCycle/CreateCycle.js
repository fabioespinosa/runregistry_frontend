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
        run_numbers: [],
        selected_run_numbers: {},
        deadline: moment()
    };
    async componentDidMount() {
        const { data: run_numbers } = await axios.get(
            `${api_url}/cycles/signed_off_run_numbers`
        );
        this.setState({
            run_numbers
        });
    }

    toggleRun(run_number) {
        const newSelectedRuns = Object.assign(
            {},
            this.state.selected_run_numbers
        );
        newSelectedRuns[run_number] = !this.state.selected_run_numbers[
            run_number
        ];
        this.setState({
            selected_run_numbers: newSelectedRuns
        });
    }

    createNewCycle = async () => {
        const { workspaces, createCycle, hideConfigurationModal } = this.props;
        const { deadline } = this.state;
        const selected_run_numbers = this.getSelectedRunNumbers().map(
            run_number => ({
                run_number
            })
        );
        const cycle_attributes = { global_state: 'pending' };
        workspaces.forEach(({ workspace }) => {
            cycle_attributes[`${workspace}_state`] = 'pending';
        });

        await createCycle({
            runs: selected_run_numbers,
            deadline,
            cycle_attributes
        });
        hideConfigurationModal();
        await Swal(`Cycle created`, '', 'success');
    };

    getSelectedRunNumbers() {
        const run_numbers = [];
        for (const [key, val] of Object.entries(
            this.state.selected_run_numbers
        )) {
            if (val) {
                run_numbers.push(key);
            }
        }
        return run_numbers;
    }
    render() {
        const { run_numbers } = this.state;
        const columns = [
            {
                Header: 'Run Number',
                accessor: 'run_number'
            },
            {
                Header: 'Selected',
                id: 'selected',
                accessor: '',
                Cell: ({ original }) => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={
                                this.state.selected_run_numbers[
                                    original.run_number
                                ] === true
                            }
                            onChange={() => this.toggleRun(original.run_number)}
                        />
                    );
                }
            }
        ];
        return (
            <div>
                <h3>Add datasets to cycle</h3>
                <br />
                <div style={{ display: 'flex' }}>
                    <ReactTable
                        style={{
                            width: 300
                        }}
                        columns={columns}
                        data={run_numbers}
                    />
                    <div style={{ marginLeft: '10px' }}>
                        <div>
                            Selected Runs:{' '}
                            {this.getSelectedRunNumbers()
                                .reverse()
                                .toString() || <i>No run numbers selected</i>}
                        </div>
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
    return {
        workspaces: state.offline.workspace.workspaces
    };
};

export default connect(
    mapStateToProps,
    { createCycle, hideConfigurationModal }
)(CreateCycle);
