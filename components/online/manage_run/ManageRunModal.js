import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideManageRunModal } from '../../../ducks/online/ui';
import ManageRun from './manageRun/ManageRun';

class ManageRunModal extends Component {
    render() {
        const {
            manage_run_modal_visible,
            hideManageRunModal,
            children,
            run
        } = this.props;

        return (
            <div>
                <Modal
                    title={`Managing Run # ${run.run_number}`}
                    visible={manage_run_modal_visible}
                    onOk={hideManageRunModal}
                    onCancel={
                        hideManageRunModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button key="submit" onClick={hideManageRunModal}>
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <ManageRun />
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
    { hideManageRunModal }
)(ManageRunModal);
