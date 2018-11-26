import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideConfigurationModal } from '../../../ducks/offline/ui';
import DatasetClassifierConfiguration from './datasetClassifierConfiguration/DatasetClassifierConfiguration';
import ComponentClassifierConfiguration from './componentClassifierConfiguration/ComponentClassifierConfiguration';
import ColumnConfiguration from './columnConfiguration/ColumnConfiguration';
import DatasetsAccepted from './datasetsAcceptedConfiguration/DatasetsAcceptedConfiguration';
import ComponentSync from './componentSyncConfiguration/ComponentSyncConfiguration';

class ConfigurationModal extends Component {
    render() {
        const {
            configuration_modal_visible,
            hideConfigurationModal,
            children,
            configuration_modal_type
        } = this.props;
        const title_options = {
            dataset_classifiers:
                'Set automatic classifiers for datasets considered significant',
            component_classifiers:
                "Set automatic classifiers for each component's status",
            column_configuration: 'Add or remove columns from workspace',
            datasets_accepted_configuration:
                'Change the RegExp of the Datasets Accepted in RR',
            component_sync: 'Sync component status from all workspaces'
        };

        return (
            <div>
                <Modal
                    title={title_options[configuration_modal_type]}
                    visible={configuration_modal_visible}
                    onOk={hideConfigurationModal}
                    onCancel={
                        hideConfigurationModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button key="submit" onClick={hideConfigurationModal}>
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    {configuration_modal_type === 'dataset_classifiers' && (
                        <DatasetClassifierConfiguration />
                    )}
                    {configuration_modal_type === 'component_classifiers' && (
                        <ComponentClassifierConfiguration />
                    )}
                    {configuration_modal_type === 'column_configuration' && (
                        <ColumnConfiguration />
                    )}
                    {configuration_modal_type ===
                        'datasets_accepted_configuration' && (
                        <DatasetsAccepted />
                    )}
                    {configuration_modal_type === 'component_sync' && (
                        <ComponentSync />
                    )}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        configuration_modal_visible:
            state.offline.ui.configuration_modal_visible,
        configuration_modal_type: state.offline.ui.configuration_modal_type
    };
};
export default connect(
    mapStateToProps,
    { hideConfigurationModal }
)(ConfigurationModal);
