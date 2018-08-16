import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import EditRun from './editRun/EditRun';

const Panel = Collapse.Panel;

class ManageRun extends Component {
    render() {
        const { run } = this.props;
        console.log(run);
        return (
            <Collapse>
                <Panel header="Run info">
                    <p>Edit Run</p>
                </Panel>
                <Panel header="Edit run">
                    <EditRun run={run} />
                </Panel>
                <Panel header="Move run">
                    <p>Edit Run</p>
                </Panel>
                <Panel header="Other">
                    <p>Edit Run</p>
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
