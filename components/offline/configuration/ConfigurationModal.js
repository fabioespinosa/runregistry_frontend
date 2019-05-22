import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideConfigurationModal } from '../../../ducks/offline/ui';
import { hideJsonEditor } from '../../../ducks/classifier_editor';
import DatasetClassifierConfiguration from './datasetClassifierConfiguration/DatasetClassifierConfiguration';
import ComponentClassifierConfiguration from '../../common/componentClassifierConfiguration/ComponentClassifierConfiguration';
import ColumnConfiguration from './columnConfiguration/ColumnConfiguration';
import DatasetsAccepted from './datasetsAcceptedConfiguration/DatasetsAcceptedConfiguration';
import DatasetCopy from './datasetCopy/DatasetCopy';
import CreateCycle from './createCycle/CreateCycle';

// For component classifier:
import {
    fetchComponentClassifiers,
    deleteComponentClassifier,
    editComponentClassifier,
    newComponentClassifier
} from '../../../ducks/offline/classifiers/component';

class ConfigurationModal extends Component {
    render() {
        const {
            configuration_modal_visible,
            hideConfigurationModal,
            hideJsonEditor,
            children,
            configuration_modal_type
        } = this.props;
        const {
            fetchComponentClassifiers,
            deleteComponentClassifier,
            editComponentClassifier,
            newComponentClassifier
        } = this.props;
        const title_types = {
            dataset_classifiers:
                'Set automatic classifiers for datasets considered significant',
            dataset_component_classifiers:
                "Set automatic classifiers for each lumisection component's status",
            column_configuration: 'Add or remove columns from workspace',
            datasets_accepted_configuration:
                'Change the RegExp of the Datasets Accepted in RR',
            dataset_copy: 'Copy datasets',
            create_cycle: 'Create cycle'
        };
        const modal_types = {
            dataset_classifiers: <DatasetClassifierConfiguration />,
            dataset_component_classifiers: (
                <ComponentClassifierConfiguration
                    online_or_offline="offline"
                    fetchComponentClassifiers={fetchComponentClassifiers}
                    deleteComponentClassifier={deleteComponentClassifier}
                    editComponentClassifier={editComponentClassifier}
                    newComponentClassifier={newComponentClassifier}
                />
            ),
            column_configuration: <ColumnConfiguration />,
            datasets_accepted_configuration: <DatasetsAccepted />,
            dataset_copy: <DatasetCopy />,
            create_cycle: <CreateCycle />
        };
        return (
            <div>
                <Modal
                    title={title_types[configuration_modal_type]}
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
                    afterClose={hideJsonEditor}
                >
                    {modal_types[configuration_modal_type]}
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
    {
        hideConfigurationModal,
        hideJsonEditor,
        fetchComponentClassifiers,
        deleteComponentClassifier,
        editComponentClassifier,
        newComponentClassifier
    }
)(ConfigurationModal);
