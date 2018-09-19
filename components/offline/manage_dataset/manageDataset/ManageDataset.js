import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import EditDataset from './editDataset/EditDataset';
import History from './history/History';

const Panel = Collapse.Panel;

class ManageRun extends Component {
    render() {
        const { run } = this.props;
        console.log(run);
        return (
            <Collapse defaultActiveKey={['2']}>
                {/* <Panel key="1" header="Run info">
                    <p>Run info</p>
                </Panel> */}
                <Panel key="2" header="Edit run">
                    <EditDataset run={run} />
                </Panel>
                <Panel key="3" header="Run History">
                    <History run={run} />
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
