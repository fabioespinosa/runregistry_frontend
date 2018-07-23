import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Icon } from 'antd';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import {
    fetchClassClassifiers,
    newClassClassifier,
    editClassClassifier,
    deleteClassClassifier
} from '../../../../ducks/online/classifiers/class/classifiers';
import {
    editClassClassifierIntent,
    newClassClassifierIntent,
    hideJsonEditor,
    changeJsonEditorValue
} from '../../../../ducks/online/classifiers/class/ui';
const TextEditor = dynamic(import('./JSONEditor/Editor'), {
    ssr: false
});
const { TextArea } = Input;

class ClassTriggerConfiguration extends Component {
    componentDidMount() {
        this.props.fetchClassClassifiers();
    }

    onEditorChange = (value, otherValue) => {
        this.props.changeJsonEditorValue(value);
    };

    saveClassClassifier = () => {
        const valid_js_object = JSON.parse(this.props.json_editor_value);
        // Check if user was editing or creating a new Trigger:
        if (this.props.currently_editing_classifier) {
            const { editing_classifier } = this.props;
            editing_classifier.classifier = valid_js_object;
            this.props.editClassClassifier(editing_classifier);
        } else {
            this.props.newClassClassifier(valid_js_object);
        }
    };
    render() {
        const columns = [
            {
                Header: 'id',
                width: 50,
                accessor: 'id',
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Priority',
                accessor: 'priority',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Enabled',
                accessor: 'enabled',
                width: 80,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <Icon
                            style={{
                                margin: '0 auto',
                                color: row.value ? 'green' : 'red'
                            }}
                            type={row.value ? 'check-circle' : 'close-circle'}
                        />
                    </div>
                )
            },
            { Header: 'JSON string', accessor: 'classifier', width: 250 },
            { Header: 'Created at', accessor: 'createdAt', width: 100 },
            { Header: 'Updated at', accessor: 'updatedAt', width: 100 },
            {
                Header: 'Edit',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() => {
                                console.log(row.original);
                                this.props.editClassClassifierIntent(
                                    row.original
                                );
                                this.props.changeJsonEditorValue(
                                    row.original.classifier
                                );
                            }}
                        >
                            Edit
                        </a>
                    </div>
                )
            },
            {
                Header: 'Delete',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() =>
                                this.props.deleteClassClassifier(
                                    row.original.id
                                )
                            }
                        >
                            Delete
                        </a>
                    </div>
                )
            }
        ];
        return (
            <div>
                <p>Current criteria:</p>
                <div>
                    <ReactTable
                        columns={columns}
                        data={this.props.classifiers}
                        defaultPageSize={10}
                        showPagination={this.props.classifiers.length > 10}
                        optionClassName="react-table"
                    />
                </div>
                <h3>
                    {this.props.editor &&
                        (this.props.currently_editing_classifier
                            ? 'Editing trigger'
                            : 'Adding new trigger')}
                </h3>
                <div className="trigger_button">
                    {!this.props.editor && (
                        <Button
                            type="primary"
                            onClick={() => {
                                this.props.newClassClassifierIntent();
                            }}
                        >
                            Add Trigger
                        </Button>
                    )}
                </div>
                {this.props.editor && (
                    <TextEditor
                        onChange={this.onEditorChange}
                        value={this.props.json_editor_value}
                        lan="javascript"
                        theme="github"
                    />
                )}
                {this.props.editor && (
                    <div className="trigger_button">
                        <span className="cancel_button">
                            <Button
                                onClick={() => {
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
        classifiers: state.online.classifiers.class.classifiers,
        editor: state.online.classifiers.class.ui.json_editor,
        json_editor_value: state.online.classifiers.class.ui.json_editor_value,
        editor_save_loading:
            state.online.classifiers.class.ui.editor_save_loading,
        currently_editing_classifier: state.online.classifiers.class.ui.editing,
        editing_classifier: state.online.classifiers.class.ui.editing_classifier
    };
};

export default connect(
    mapStateToProps,
    {
        fetchClassClassifiers,
        newClassClassifier,
        editClassClassifier,
        deleteClassClassifier,
        editClassClassifierIntent,
        newClassClassifierIntent,
        hideJsonEditor,
        changeJsonEditorValue
    }
)(ClassTriggerConfiguration);

const long_string = `{
   "ECAL": {
      "good": [
         {
            "type": "and",
            "condition": [
               {
                  "type": ">",
                  "identifier": "events",
                  "value": 100
               },
               {
                  "type": "<",
                  "identifier": "runLiveLumi",
                  "value": 80
               }
            ]
         },
         {
            "type": "or",
            "condition": [
               {
                  "type": "=",
                  "identifier": "beam1Stable",
                  "value": "false"
               }
            ]
         }
      ],
      "bad": []
   }
}`;
