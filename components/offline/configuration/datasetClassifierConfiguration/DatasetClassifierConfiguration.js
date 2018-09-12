import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { Select, Icon } from 'antd';
import {
    fetchDatasetClassifier,
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
    async componentDidMount() {
        const { fetchDatasetClassifier, editClassifierIntent } = this.props;
        const classifier = await fetchDatasetClassifier();
        classifier.classifier = this.getDisplayedClassifier(
            classifier.classifier
        );
        editClassifierIntent(classifier);
    }

    getDisplayedClassifier = classifier => {
        classifier = JSON.parse(classifier);
        const displayed_text = classifier.if[0];
        return stringify(displayed_text);
    };

    formatClassifierCorrectly = inside_input => {
        const parsed_input = JSON.parse(inside_input);
        let classifier = {
            if: [parsed_input, 'CREATE_DATASET', 'IRRELEVANT']
        };
        return classifier;
    };

    render() {
        const { editDatasetClassifier } = this.props;
        return (
            <div>
                <p>Current Dataset Classifier criteria:</p>
                <Editor
                    show_cancel={false}
                    formatClassifierCorrectly={this.formatClassifierCorrectly}
                    editClassifier={async valid_js_object => {
                        await editDatasetClassifier(valid_js_object);
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
        fetchDatasetClassifier,
        editDatasetClassifier,
        editClassifierIntent,
        changeJsonEditorValue
    }
)(DatasetClassifierConfiguration);
