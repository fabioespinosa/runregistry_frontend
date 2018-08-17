import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideLumisectionModal } from '../../../ducks/online/ui';
// import ManageRun from './manageRun/ManageRun';

class LumisectionModal extends Component {
    render() {
        const {
            manage_run_modal_visible,
            hideLumisectionModal,
            children,
            run
        } = this.props;

        return (
            <div>
                <Modal
                    title={`Lumisections of run # ${run.run_number}`}
                    visible={manage_run_modal_visible}
                    onOk={hideLumisectionModal}
                    onCancel={
                        hideLumisectionModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button key="submit" onClick={hideLumisectionModal}>
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    {/* <ManageRun /> */}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        manage_run_modal_visible: state.online.ui.lumisection_modal_visible,
        run: state.online.ui.lumisection_modal_run
    };
};
export default connect(
    mapStateToProps,
    { hideLumisectionModal }
)(LumisectionModal);
