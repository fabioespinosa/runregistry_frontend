import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideConfigurationModal } from '../../../ducks/online';

class ConfigurationModal extends Component {
    render() {
        const {
            configuration_modal_visible,
            hideConfigurationModal
        } = this.props;
        return (
            <div>
                <Modal
                    title="Configuration of Online RR"
                    visible={configuration_modal_visible}
                    onOk={hideConfigurationModal} // confirmLoading={confirmLoading}
                    onCancel={hideConfigurationModal}
                    width={900}
                >
                    <p>CONFIGURATION...</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
        configuration_modal_visible: state.online.ui.configuration_modal_visible
    };
};
export default connect(mapStateToProps, { hideConfigurationModal })(
    ConfigurationModal
);
