import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import EditDCSBits from './editDCSBits/EditDCSBits';
import EditDataset from './editDataset/EditDataset';
import RunInfo from '../../../online/manage_run/manageRun/runInfo/RunInfo';

const Panel = Collapse.Panel;

class ManageDataset extends Component {
  render() {
    const { dataset } = this.props;
    return (
      <Collapse defaultActiveKey={['4']}>
        <Panel key="1" header="Run info">
          <RunInfo run={dataset.Run} />
        </Panel>
        {/* <Panel key="2" header="Dataset History">
          <div>
            This feature is still in development, history is being saved but the
            interface to show it is currently being built
          </div>
        </Panel> */}
        <Panel key="3" header="Edit DCS bits">
          <EditDCSBits dataset={dataset} />
        </Panel>
        <Panel key="4" header="Edit dataset">
          <EditDataset dataset={dataset} />
        </Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataset: state.offline.ui.manage_dataset_modal_dataset,
  };
};

export default connect(mapStateToProps)(ManageDataset);
