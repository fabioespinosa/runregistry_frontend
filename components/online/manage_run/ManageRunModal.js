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
            children
        } = this.props;

        return (
            <div>
                <Modal
                    title={'Manage Run'}
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
        manage_run_modal_visible: state.online.ui.manage_run_modal_visible
    };
};
export default connect(
    mapStateToProps,
    { hideManageRunModal }
)(ManageRunModal);
