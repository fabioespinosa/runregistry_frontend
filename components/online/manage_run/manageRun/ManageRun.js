import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import EditRun from './editRunAttributes/EditRun';
import History from './history/History';

const Panel = Collapse.Panel;

class ManageRun extends Component {
    render() {
        const { run } = this.props;
        console.log(run);
        return (
            <Collapse defaultActiveKey={['4']}>
                {/* <Panel key="1" header="Run info">
                    <p>Run info</p>
                </Panel> */}
                <Panel key="2" header="Run History">
                    <History run_number={run.run_number} />
                </Panel>
                <Panel
                    key="3"
                    header="Edit Run Attributes (Run Class, Run Stop Reason)"
                >
                    {run.state === 'OPEN' ? (
                        <EditRun run={run} />
                    ) : (
                        <div>Run must be in state OPEN to be edited</div>
                    )}
                </Panel>
                <Panel
                    key="4"
                    header="Edit Run's Lumisections (GOOD/BAD/STANDBY...)"
                >
                    {run.state === 'OPEN' ? (
                        <EditRun run={run} />
                    ) : (
                        <div>Run must be in state OPEN to be edited</div>
                    )}
                </Panel>
            </Collapse>
        );
    }
}

const mapStateToProps = state => {
    return {
        run: state.online.ui.manage_run_modal_run
    };
};

export default connect(mapStateToProps)(ManageRun);
