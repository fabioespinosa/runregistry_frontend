import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { Select, Icon } from 'antd';
import {
    fetchDatasetClassifiers,
    editDatasetClassifier
} from '../../../../ducks/offline/classifiers/dataset';
import {
    editClassifierIntent,
    changeJsonEditorValue
} from '../../../../ducks/classifier_editor';
import stringify from 'json-stringify-pretty-compact';
const { Option } = Select;

const Editor = dynamic(
    import('../../../common/ClassifierEditor/ClassifierEditor'),
    {
        ssr: false
    }
);

class DatasetClassifierConfiguration extends Component {
    state = { workspace: 'global', classifiers: {} };
    async componentDidMount() {
        const { fetchDatasetClassifiers, editClassifierIntent } = this.props;
        const classifiers = await fetchDatasetClassifiers();
        const classifiers_object = {};
        classifiers.forEach(classifier => {
            classifiers_object[classifier.workspace] = classifier;
        });
        const displayed_classifier = classifiers_object[this.state.workspace];
        displayed_classifier.classifier = this.getDisplayedClassifier(
            displayed_classifier.classifier
        );
        this.setState({ ...this.state, classifiers: classifiers_object });
        editClassifierIntent(displayed_classifier);
    }

    getDisplayedClassifier = classifier => {
        if (typeof classifier === 'string') {
            classifier = JSON.parse(classifier);
        }
        const displayed_text = classifier.if[0];
        return stringify(displayed_text);
    };

    formatClassifierCorrectly = inside_input => {
        const parsed_input = JSON.parse(inside_input);
        let classifier = {
            if: [parsed_input, true, false]
        };
        return classifier;
    };

    changeWorkspaceSelector = workspace => {
        const displayed_classifier = this.state.classifiers[workspace];
        displayed_classifier.classifier = this.getDisplayedClassifier(
            displayed_classifier.classifier
        );
        this.props.editClassifierIntent(displayed_classifier);
        this.setState({ ...this.state, workspace });
    };

    render() {
        const {
            editDatasetClassifier,
            editClassifierIntent,
            changeJsonEditorValue,
            dataset_classifiers
        } = this.props;
        const { workspace } = this.state;
        const workspaces = [];
        const classifiers = this.state.classifiers;
        for (const [workspace, val] of Object.entries(classifiers)) {
            workspaces.push(<Option key={workspace}>{workspace}</Option>);
        }
        return (
            <div>
                &nbsp;
                <p>
                    Whenever a dataset appears in DQM GUI, it will run all the
                    dataset's workspace classifiers' to check if the run is
                    significant to the respective workspace:
                </p>
                <p>
                    If the run is significant to the respective workspace it
                    will appear in the editable list
                </p>
                <label htmlFor="workspace_select">Workspace: &nbsp;</label>
                {workspaces.length && (
                    <Select
                        name=""
                        id="workspace_select"
                        defaultValue={workspace}
                        onChange={this.changeWorkspaceSelector}
                    >
                        {workspaces}
                    </Select>
                )}
                <Editor
                    show_cancel={false}
                    formatClassifierCorrectly={this.formatClassifierCorrectly}
                    editClassifier={async valid_js_object => {
                        await editDatasetClassifier(valid_js_object, workspace);
                        await Swal(
                            `Dataset classifier edited successfully`,
                            '',
                            'success'
                        );
                    }}
                />
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        classifier: state.offline.classifiers.dataset
    };
};

export default connect(
    mapStateToProps,
    {
        fetchDatasetClassifiers,
        editDatasetClassifier,
        editClassifierIntent,
        changeJsonEditorValue
    }
)(DatasetClassifierConfiguration);
