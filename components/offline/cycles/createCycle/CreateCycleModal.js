import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideCreateCycleModal } from '../../../../ducks/offline/ui';
import CreateCycle from './CreateCycle';

class CreateCycleModal extends Component {
    render() {
        const { create_cycle_modal_visible, hideCreateCycleModal } = this.props;
        return (
            <div>
                <Modal
                    title="Create Cycle"
                    visible={create_cycle_modal_visible}
                    onOk={hideCreateCycleModal}
                    onCancel={
                        hideCreateCycleModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button key="submit" onClick={hideCreateCycleModal}>
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <CreateCycle />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        create_cycle_modal_visible: state.offline.ui.create_cycle_modal_visible
    };
};
export default connect(
    mapStateToProps,
    { hideCreateCycleModal }
)(CreateCycleModal);
