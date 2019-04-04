import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button } from 'antd';
import moment from 'moment';
import { getCycles, selectCycle } from '../../../ducks/offline/cycles';
import {
    filterEditableDatasets,
    filterWaitingDatasets,
    clearDatasets
} from '../../../ducks/offline/datasets';

class Cycles extends Component {
    async componentDidMount() {
        await this.props.getCycles();
        const { cycles } = this.props;
        if (cycles.length > 0) {
            this.displayCycle(cycles[0]);
        } else {
            // Don't display any datasets then:
            this.props.clearDatasets();
        }
    }
    displayCycle = selected_cycle => {
        this.props.selectCycle(selected_cycle);
        // We filter now only the datasets in the cycle:
        const datasets_filter = selected_cycle.datasets.map(
            ({ run_number, name }) => ({
                and: {
                    run_number: {
                        '=': run_number
                    },
                    name: {
                        '=': name
                    }
                }
            })
        );
        const filter = {
            or: datasets_filter
        };

        this.props.filterWaitingDatasets(5, 0, [], filter);
        this.props.filterEditableDatasets(20, 0, [], filter);
    };
    render() {
        const { cycles, selected_cycle, workspace } = this.props;
        return (
            <div className="cycles">
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
                                                {cycle.id_cycle} - Due:{' '}
                                                {moment(cycle.deadline).format(
                                                    'dddd, MMMM Do YYYY'
                                                )}
                                            </a>
                                        }
                                        description={`Status: ${workspace_status}, Contains ${
                                            cycle.datasets.length
                                        } Dataset(s)`}
                                    />
                                </List.Item>
                            );
                        }}
                    />
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
        selectCycle,
        filterEditableDatasets,
        filterWaitingDatasets,
        clearDatasets
    }
)(Cycles);
