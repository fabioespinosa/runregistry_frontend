import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideConfigurationModal } from '../../../ducks/online';
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
                        <Button key="back" onClick={hideConfigurationModal}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => {
                                this.setState({
                                    loading: true
                                });
                                setTimeout(() => {
                                    this.setState({ loading: false });
                                    hideConfigurationModal();
                                }, 700);
                            }}
                        >
                            Ok
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
