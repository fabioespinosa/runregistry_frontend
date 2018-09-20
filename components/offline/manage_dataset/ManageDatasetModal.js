import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideManageDatasetModal } from '../../../ducks/offline/ui';
import ManageDataset from './manageDataset/ManageDataset';

class ManageDatasetModal extends Component {
    render() {
        const {
            manage_dataset_modal_visible,
            hideManageDatasetModal,
            children,
            dataset
        } = this.props;

        return (
            <div>
                <Modal
                    title={`Managing Dataset # ${dataset.name} of run ${
                        dataset.run_number
                    }`}
                    visible={manage_dataset_modal_visible}
                    onOk={hideManageDatasetModal}
                    onCancel={
                        hideManageDatasetModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button key="submit" onClick={hideManageDatasetModal}>
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <ManageDataset />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        manage_dataset_modal_visible:
            state.offline.ui.manage_dataset_modal_visible,
        dataset: state.offline.ui.manage_dataset_modal_dataset
    };
};
export default connect(
    mapStateToProps,
    { hideManageDatasetModal }
)(ManageDatasetModal);
