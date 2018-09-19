import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideManageDatasetModal } from '../../../ducks/online/ui';
import ManageDataset from './manageDataset/ManageDataset';

class ManageDatasetModal extends Component {
    render() {
        const {
            manage_run_modal_visible,
            hideManageDatasetModal,
            children,
            run
        } = this.props;

        return (
            <div>
                <Modal
                    title={`Managing Run # ${run.run_number}`}
                    visible={manage_run_modal_visible}
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
        manage_run_modal_visible: state.online.ui.manage_run_modal_visible,
        run: state.online.ui.manage_run_modal_run
    };
};
export default connect(
    mapStateToProps,
    { hideManageDatasetModal }
)(ManageDatasetModal);
