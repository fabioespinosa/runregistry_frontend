import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { hideClassifierVisualizationModal } from '../../../ducks/online/ui';
import ClassifierVisualization from './classifierVisualization/ClassifierVisualization';

class ClassifierVisualizationModal extends Component {
    render() {
        const {
            classifier_visualization_modal,
            hideClassifierVisualizationModal,
            children,
            run
        } = this.props;
        return (
            <div>
                <Modal
                    title={`Classifier Visualization for Run ${run.run_number}`}
                    visible={classifier_visualization_modal}
                    onOk={hideClassifierVisualizationModal}
                    onCancel={
                        hideClassifierVisualizationModal // confirmLoading={confirmLoading}
                    }
                    footer={[
                        <Button
                            key="submit"
                            onClick={hideClassifierVisualizationModal}
                        >
                            Close
                        </Button>
                    ]}
                    width="90vw"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <ClassifierVisualization run={run} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        classifier_visualization_modal:
            state.online.ui.classifier_visualization_modal,
        run: state.online.ui.classifier_visualization_modal_run
    };
};
export default connect(
    mapStateToProps,
    { hideClassifierVisualizationModal }
)(ClassifierVisualizationModal);
