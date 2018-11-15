import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideLumisectionModal } from '../../../ducks/offline/ui';
import Lumisections from './lumisections/Lumisections';

class LumisectionModal extends Component {
    render() {
        const {
            manage_dataset_modal_visible,
            hideLumisectionModal,
            children,
            dataset
        } = this.props;

        return (
            <div>
                <Modal
                    title={`Lumisections of dataset ${dataset.name} of run # ${
                        dataset.run_number
                    }`}
                    visible={manage_dataset_modal_visible}
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
                    <Lumisections dataset={dataset} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        manage_dataset_modal_visible:
            state.offline.ui.lumisection_modal_visible,
        dataset: state.offline.ui.lumisection_modal_dataset
    };
};
export default connect(
    mapStateToProps,
    { hideLumisectionModal }
)(LumisectionModal);
