import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button } from 'antd';
import moment from 'moment';
import { getCycles, selectCycle } from '../../../ducks/offline/cycles';
import { filterDatasets } from '../../../ducks/offline/datasets';
import { filterDatasets as filterWaitingDatasets } from '../../../ducks/offline/waiting_datasets';
import { showCreateCycleModal } from '../../../ducks/offline/ui';
import CreateCycleModal from './createCycle/CreateCycleModal';

class Cycles extends Component {
    componentDidMount() {
        this.props.getCycles();
    }
    displayCycle = selected_cycle => {
        this.props.selectCycle(selected_cycle);
        const run_numbers = selected_cycle.Runs.map(({ run_number }) => ({
            '=': run_number
        }));
        const filter = {
            run_number: {
                or: run_numbers
            }
        };
        this.props.filterWaitingDatasets(5, 0, [], filter);
        this.props.filterDatasets(20, 0, [], filter);
    };
    render() {
        const { cycles, selected_cycle, workspace } = this.props;
        return (
            <div className="cycles">
                <CreateCycleModal />
                <h3>Certification Cycles</h3>
                <div className="cycle_list">
                    <List
                        itemLayout="horizontal"
                        bordered
                        dataSource={cycles}
                        renderItem={cycle => {
                            let isSelected = false;
                            if (selected_cycle) {
                                isSelected =
                                    cycle.id_cycle === selected_cycle.id_cycle;
                            }
                            const workspace_status =
                                cycle.cycle_attributes[
                                    `${workspace.toLowerCase()}_state`
                                ];

                            return (
                                <List.Item
                                    onClick={this.displayCycle.bind(
                                        this,
                                        cycle
                                    )}
                                    style={{
                                        backgroundColor:
                                            workspace_status === 'pending'
                                                ? 'rgba(200,90,50,0.1)'
                                                : '',
                                        border: isSelected
                                            ? '0.5px solid black'
                                            : '',
                                        borderRadius: '5px'
                                    }}
                                >
                                    <List.Item.Meta
                                        title={
                                            <a
                                                style={
                                                    isSelected
                                                        ? {
                                                              color: '#1890ff',
                                                              textDecoration:
                                                                  'underline',
                                                              fontSize: 'bold'
                                                          }
                                                        : {}
                                                }
                                            >
                                                Cycle {cycle.id_cycle}, Due:{' '}
                                                {moment(cycle.deadline).format(
                                                    'dddd, MMMM Do YYYY'
                                                )}
                                            </a>
                                        }
                                        description={`Status: ${workspace_status}, Contains ${
                                            cycle.Runs.length
                                        } Run(s)`}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </div>
                <div className="create_cycle">
                    <Button onClick={this.props.showCreateCycleModal}>
                        Create new cycle
                    </Button>
                </div>
                <style jsx>{`
                    .cycles {
                        margin-right: 30px;
                    }
                    .cycle_list {
                        height: 500px;
                        overflow-y: scroll;
                    }
                    .create_cycle {
                        text-align: center;
                        margin-top: 20px;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cycles: state.offline.cycles.cycles,
        selected_cycle: state.offline.cycles.selected_cycle,
        workspace: state.offline.workspace.workspace
    };
};
export default connect(
    mapStateToProps,
    {
        getCycles,
        showCreateCycleModal,
        selectCycle,
        filterDatasets,
        filterWaitingDatasets
    }
)(Cycles);
