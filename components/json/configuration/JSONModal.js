import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideModal } from '../../../ducks/json/ui';
import JSONConfiguration from './json_configuration/JSONConfiguration';
import VisualizeJSON from './visualize_json/VisualizeJSON';

class ConfigurationModal extends Component {
    render() {
        const { modal_visible, modal_type, hideModal } = this.props;

        const title_types = {
            create_json: "Create new 'golden' JSON",
            visualize_json:
                'Why is this run (and lumisections) included (or not) in current json configuration?'
        };
        const modal_types = {
            create_json: <JSONConfiguration />,
            visualize_json: <VisualizeJSON />
        };
        return (
            <div>
                <Modal
                    title={title_types[modal_type]}
                    visible={modal_visible}
                    onOk={hideModal}
                    onCancel={
                        hideModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button key="submit" onClick={hideModal}>
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                    afterClose={hideModal}
                >
                    {modal_types[modal_type]}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        modal_visible: state.json.ui.modal_visible,
        modal_type: state.json.ui.modal_type
    };
};
export default connect(
    mapStateToProps,
    {
        hideModal
    }
)(ConfigurationModal);
