import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Select } from 'antd';

import {
    editClassClassifier,
    newClassClassifier
} from '../../../../../ducks/online/classifiers/class/classifiers';
import {
    hideJsonEditor,
    changeJsonEditorValue,
    newClassClassifierIntent
} from '../../../../../ducks/online/classifiers/class/ui';

import TextEditor from './JSONEditor/JSONEditor';

const { Option } = Select;

class ClassClassifierEditor extends Component {
    state = { class_selected: 'COSMICS' };

    onEditorChange = (value, otherValue) => {
        this.props.changeJsonEditorValue(value);
    };

    saveClassClassifier = () => {
        const { class_selected } = this.state;
        const valid_js_object = JSON.parse(this.props.json_editor_value);
        // Check if user was editing or creating a new Classifier:
        if (this.props.currently_editing_classifier) {
            const { editing_classifier } = this.props;
            editing_classifier.classifier = valid_js_object;
            this.props.editClassClassifier(editing_classifier);
        } else {
            this.props.newClassClassifier(valid_js_object, class_selected);
        }
    };
    render() {
        const { show, currently_editing_classifier } = this.props;
        const { class_selected } = this.state;
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
                        <label htmlFor="class_select">Class:</label>&nbsp;
                        <Select
                            name=""
                            id="class_select"
                            defaultValue={class_selected}
                            onChange={value =>
                                this.setState({ class_selected: value })
                            }
                        >
                            <Option value="COSMICS">COSMICS</Option>
                            <Option value="COLLISSIONS">COLLISSIONS</Option>
                            <Option value="COSMMISSION">COMMISSION</Option>
                        </Select>
                        <br />
                        <br />
                        <TextEditor
                            onChange={this.onEditorChange}
                            value={this.props.json_editor_value}
                            lan="javascript"
                            theme="github"
                        />
                        <div className="trigger_button">
                            <span className="cancel_button">
                                <Button
                                    onClick={() => {
                                        this.setState({
                                            class_selected: false
                                        });
                                        this.props.hideJsonEditor();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </span>
                            <Button
                                loading={this.props.editor_save_loading}
                                type="primary"
                                onClick={this.saveClassClassifier}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="trigger_button">
                        <Button
                            type="primary"
                            onClick={() => {
                                this.props.newClassClassifierIntent();
                            }}
                        >
                            Add Trigger
                        </Button>
                    </div>
                )}
                <style jsx>{`
                    .trigger_button {
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
        show: state.online.classifiers.class.ui.json_editor,
        json_editor_value: state.online.classifiers.class.ui.json_editor_value,
        currently_editing_classifier: state.online.classifiers.class.ui.editing,
        editor_save_loading:
            state.online.classifiers.class.ui.editor_save_loading,
        editing_classifier: state.online.classifiers.class.ui.editing_classifier
    };
};

export default connect(
    mapStateToProps,
    {
        hideJsonEditor,
        changeJsonEditorValue,
        editClassClassifier,
        newClassClassifier,
        newClassClassifierIntent
    }
)(ClassClassifierEditor);
