import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Badge } from 'antd';
import moment from 'moment';
import { getCycles, selectCycle } from '../../../ducks/offline/cycles';
import {
  filterEditableDatasets,
  filterWaitingDatasets,
  clearDatasets
} from '../../../ducks/offline/datasets';

class Cycles extends Component {
  async componentDidMount() {
    const { workspace } = this.props;
    await this.props.getCycles(workspace);
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
        and: [
          {
            run_number: {
              '=': run_number
            }
          },
          {
            name: {
              '=': name
            }
          }
        ]
      })
    );
    const filter = {
      or: datasets_filter
    };

    this.props.filterWaitingDatasets(5, 0, [], filter);
    this.props.filterEditableDatasets(20, 0, [], filter);
  };
  componentDidUpdate(prevProps) {
    const { selected_cycle } = this.props;
    if (prevProps.selected_cycle === null && selected_cycle) {
      this.displayCycle(selected_cycle);
    }
    if (
      selected_cycle !== null &&
      prevProps.selected_cycle &&
      selected_cycle.cycle_id !== prevProps.selected_cycle.cycle_id
    ) {
      this.displayCycle(selected_cycle);
    }
  }
  render() {
    const { cycles, selected_cycle, workspace } = this.props;
    return (
      <div className="cycles">
        <center>
          <h3>Certif. Cycles</h3>
        </center>
        <div className="cycle_list">
          <List
            itemLayout="horizontal"
            bordered
            dataSource={cycles}
            renderItem={cycle => {
              let isSelected = false;
              if (selected_cycle) {
                isSelected = cycle.id_cycle === selected_cycle.id_cycle;
              }
              const workspace_status =
                cycle.cycle_attributes[`${workspace.toLowerCase()}_state`];

              return (
                <List.Item
                  onClick={this.displayCycle.bind(this, cycle)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(9,30,66,0.08)' : '',
                    paddingLeft: '15px',
                    paddingRight: '5px'
                    // backgroundColor:
                    //     workspace_status === 'pending'
                    //         ? 'rgba(200,90,50,0.1)'
                    //         : '',
                    // border: isSelected
                    //     ? '0.5px solid black'
                    //     : '0.5px solid silver',
                    // borderRadius: '5px'
                  }}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        <Badge
                          status={
                            workspace_status === 'completed'
                              ? 'success'
                              : 'error'
                          }
                        />{' '}
                        <a
                          className="underline"
                          style={
                            isSelected
                              ? {
                                  color: '#1890ff',
                                  fontSize: 'bold'
                                }
                              : {}
                          }
                        >
                          Cycle {cycle.id_cycle}{' '}
                        </a>
                      </div>
                    }
                    description=""
                  />
                </List.Item>
              );
            }}
          />
        </div>
        <style jsx>{`
          .cycles {
            margin-right: 20px;
            min-width: 115px;
          }
          .cycle_list {
            height: 80vh;
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
export default connect(mapStateToProps, {
  getCycles,
  selectCycle,
  filterEditableDatasets,
  filterWaitingDatasets,
  clearDatasets
})(Cycles);
