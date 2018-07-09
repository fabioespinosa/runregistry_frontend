import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideConfigurationModal } from '../../../ducks/online/ui';
import ClassTriggerConfiguration from './classTriggerConfiguration/ClassTriggerConfiguration';
import PreSelectionTriggerConfiguration from './preSelectionTriggerConfiguration/PreSelectionTriggerConfiguration';

class ConfigurationModal extends Component {
    state = {
        loading: false
    };
    render() {
        const {
            configuration_modal_visible,
            hideConfigurationModal,
            children,
            configuration_modal_type
        } = this.props;
        const title =
            configuration_modal_type === 'class_configuration'
                ? 'Set Automatic triggers for class of run selection'
                : configuration_modal_type === 'pre_selection_configuration'
                    ? 'Set automatic triggers for pre selection of runs'
                    : '';
        const { loading } = this.state;
        return (
            <div>
                <Modal
                    title={title}
                    visible={configuration_modal_visible}
                    onOk={hideConfigurationModal} // confirmLoading={confirmLoading}
                    onCancel={hideConfigurationModal}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={hideConfigurationModal}
                        >
                            Close
                        </Button>
                    ]}
                    width={900}
                >
                    <ClassTriggerConfiguration />

                    {/* // {configuration_modal_type === 'class_configuration' && (
                    //     <ClassTriggerConfiguration />
                    // )}
                    // {configuration_modal_type ===
                    //     'pre_selection_configuration' && (
                    //     <PreSelectionTriggerConfiguration />
                    // )} */}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        configuration_modal_visible:
            state.online.ui.configuration_modal_visible,
        configuration_modal_type: state.online.ui.configuration_modal_type
    };
};
export default connect(
    mapStateToProps,
    { hideConfigurationModal }
)(ConfigurationModal);
