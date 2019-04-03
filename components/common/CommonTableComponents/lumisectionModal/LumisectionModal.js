import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideLumisectionModal } from '../../../../ducks/global_ui';
import Lumisections from './lumisections/Lumisections';

class LumisectionModal extends Component {
    render() {
        const {
            lumisection_modal_visible,
            hideLumisectionModal,
            children,
            dataset
        } = this.props;
        let { run_number, name } = dataset;
        // If we are in online, the dataset name is 'online'
        name = name || 'online';
        return (
            <div>
                <Modal
                    title={`Lumisections of run # ${run_number} from ${name}`}
                    visible={lumisection_modal_visible}
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
                    <Lumisections run_number={run_number} dataset_name={name} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        lumisection_modal_visible: state.global_ui.lumisection_modal_visible,
        dataset: state.global_ui.lumisection_modal_dataset
    };
};
export default connect(
    mapStateToProps,
    { hideLumisectionModal }
)(LumisectionModal);
