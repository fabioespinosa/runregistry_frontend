import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import {
    hideJsonEditor,
    changeJsonEditorValue,
    newClassifierIntent
} from '../../../ducks/classifier_editor';

import TextEditor from './JSONEditor/JSONEditor';

class ClassifierEditor extends Component {
    onEditorChange = (value, otherValue) => {
        this.props.changeJsonEditorValue(value);
    };

    saveClassClassifier = () => {
        const {
            json_editor_value,
            formatClassifierCorrectly,
            editClassifier,
            newClassifier,
            currently_editing_classifier
        } = this.props;

        const valid_js_object = formatClassifierCorrectly(json_editor_value);
        console.log(valid_js_object);
        // Check if user was editing or creating a new Classifier:
        if (currently_editing_classifier) {
            const { editing_classifier } = this.props;
            editing_classifier.classifier = valid_js_object;
            editClassifier(editing_classifier);
        } else {
            newClassifier(valid_js_object);
        }
    };

    render() {
        console.log(json_editor_value);
        const {
            show,
            json_editor_value,
            currently_editing_classifier,
            hideJsonEditor,
            editor_save_loading,
            newClassifierIntent,
            children,
            show_cancel
        } = this.props;
        return (
            <div>
                {show ? (
                    <div>
                        <h3>
                            {currently_editing_classifier
                                ? 'Editing classifier'
                                : 'Adding new classifier'}
                        </h3>
                        <br />
                        {children ? (
                            <div>
                                {children}
                                <br />
                            </div>
                        ) : (
                            <div />
                        )}

                        <TextEditor
                            onChange={this.onEditorChange}
                            value={json_editor_value}
                            lan="javascript"
                            theme="github"
                        />
                        <div className="classsifier_button">
                            {show_cancel !== false && (
                                <span className="cancel_button">
                                    <Button
                                        onClick={() => {
                                            if (
                                                typeof this.props.onCancel ===
                                                'function'
                                            ) {
                                                this.props.onCancel();
                                            }
                                            hideJsonEditor();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </span>
                            )}
                            <Button
                                loading={editor_save_loading}
                                type="primary"
                                onClick={this.saveClassClassifier}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="classsifier_button">
                        <Button type="primary" onClick={newClassifierIntent}>
                            Add Classifier
                        </Button>
                    </div>
                )}
                <style jsx>{`
                    .classsifier_button {
                        margin-top: 20px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: flex-end;
                    }

                    .cancel_button {
                        margin-right: 10px;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        show: state.classifier_editor.json_editor,
        json_editor_value: state.classifier_editor.json_editor_value,
        currently_editing_classifier: state.classifier_editor.editing,
        editor_save_loading: state.classifier_editor.editor_save_loading,
        editing_classifier: state.classifier_editor.editing_classifier
    };
};

export default connect(
    mapStateToProps,
    {
        hideJsonEditor,
        changeJsonEditorValue,
        newClassifierIntent
    }
)(ClassifierEditor);
