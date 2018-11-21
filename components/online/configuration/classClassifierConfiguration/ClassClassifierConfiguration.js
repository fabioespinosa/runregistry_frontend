import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, InputNumber, Icon } from 'antd';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import Swal from 'sweetalert2';
import {
    fetchClassClassifiers,
    deleteClassClassifier,
    editClassClassifier,
    newClassClassifier
} from '../../../../ducks/online/classifiers/class';
import {
    editClassifierIntent,
    changeJsonEditorValue
} from '../../../../ducks/classifier_editor';
import stringify from 'json-stringify-pretty-compact';

const Editor = dynamic(
    import('../../../common/ClassifierEditor/ClassifierEditor'),
    {
        ssr: false
    }
);

class ClassClassifierConfiguration extends Component {
    state = { class_selected: '', is_editing: false };
    componentDidMount() {
        this.props.fetchClassClassifiers();
    }

    getDisplayedClassifier(classifier) {
        classifier = JSON.parse(classifier);
        const displayed_text = classifier.if[0];
        return stringify(displayed_text);
    }

    formatClassifierCorrectly = inside_input => {
        const parsed_input = JSON.parse(inside_input);
        let classifier = {
            if: [parsed_input, true, false]
        };
        return classifier;
    };

    getDisplayedClass = classifier => {
        classifier = JSON.parse(classifier);
        const displayed_text = classifier.if[classifier.if.length - 2];
        return displayed_text;
    };

    render() {
        const {
            newClassClassifier,
            editClassClassifier,
            editClassifierIntent,
            changeJsonEditorValue,
            deleteClassClassifier,
            classifiers
        } = this.props;
        const { class_selected, priority } = this.state;
        const columns = [
            {
                Header: 'Priority',
                accessor: 'priority',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Class',
                accessor: 'class',
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
            {
                Header: 'JSON string',
                accessor: 'classifier',
                width: 250,
                Cell: row => {
                    const displayed_text = this.getDisplayedClassifier(
                        row.value
                    );
                    return <span>{displayed_text}</span>;
                }
            },
            { Header: 'Created at', accessor: 'createdAt', width: 100 },
            { Header: 'Updated at', accessor: 'updatedAt', width: 100 },
            {
                Header: 'Edit',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() => {
                                this.setState({
                                    class_selected: row.original.class,
                                    priority: row.original.priority,
                                    is_editing: true
                                });
                                const classifier = this.getDisplayedClassifier(
                                    row.original.classifier
                                );
                                editClassifierIntent(row.original);
                                changeJsonEditorValue(classifier);
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
                            onClick={async () => {
                                const { value } = await Swal({
                                    type: 'warning',
                                    title:
                                        'Are you sure you want to delete this Class classifier',
                                    text: '',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes',
                                    reverseButtons: true
                                });
                                if (value) {
                                    await deleteClassClassifier(
                                        row.original.id
                                    );
                                    await Swal(
                                        `Classifier deleted`,
                                        '',
                                        'success'
                                    );
                                }
                            }}
                        >
                            Delete
                        </a>
                    </div>
                )
            }
        ];
        return (
            <div>
                <p>Current Class Classifier criteria:</p>
                <ReactTable
                    columns={columns}
                    data={classifiers}
                    defaultPageSize={10}
                    showPagination={classifiers.length > 10}
                    optionClassName="react-table"
                />
                <Editor
                    formatClassifierCorrectly={this.formatClassifierCorrectly}
                    newClassifier={valid_js_object => {
                        newClassClassifier(
                            valid_js_object,
                            class_selected,
                            priority
                        );
                        this.setState({
                            is_editing: false,
                            class_selected: ''
                        });
                    }}
                    onCancel={() => {
                        this.setState({ is_editing: false });
                    }}
                    editClassifier={valid_js_object =>
                        editClassClassifier(
                            valid_js_object,
                            class_selected,
                            priority
                        )
                    }
                >
                    {this.state.is_editing ? (
                        <div>
                            Editing classifier for class{' '}
                            <strong>{this.state.class_selected}</strong>
                            <br />
                            Priority:{' '}
                            <InputNumber
                                min={1}
                                onChange={value =>
                                    this.setState({ priority: value })
                                }
                                value={this.state.priority}
                            />
                        </div>
                    ) : (
                        <div className="class_name_input">
                            <Input
                                addonBefore="For runs of class:"
                                placeholder="Insert class name"
                                onChange={evt =>
                                    this.setState({
                                        class_selected: evt.target.value
                                    })
                                }
                            />
                            Priority:{' '}
                            <InputNumber
                                min={1}
                                onChange={value =>
                                    this.setState({ priority: value })
                                }
                                value={this.state.priority}
                            />
                        </div>
                    )}
                </Editor>
                <style jsx>{`
                    .class_name_input {
                        width: 500px;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        classifiers: state.online.classifiers.class
    };
};

export default connect(
    mapStateToProps,
    {
        fetchClassClassifiers,
        deleteClassClassifier,
        editClassClassifier,
        newClassClassifier,
        changeJsonEditorValue,
        editClassifierIntent
    }
)(ClassClassifierConfiguration);
