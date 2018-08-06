import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Icon } from 'antd';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
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
const { Option } = Select;

const Editor = dynamic(
    import('../../../common/ClassifierEditor/ClassifierEditor'),
    {
        ssr: false
    }
);

class ClassClassifierConfiguration extends Component {
    state = { class_selected: 'COLLISSIONS' };
    componentDidMount() {
        this.props.fetchClassClassifiers();
    }

    getDisplayedClassifier(classifier) {
        classifier = JSON.parse(classifier);
        const displayed_text = classifier.if[0];
        return stringify(displayed_text);
    }

    formatClassifierCorrectly = inside_input => {
        const { class_selected } = this.state;
        const parsed_input = JSON.parse(inside_input);
        let classifier = {
            if: [parsed_input, class_selected, 'COMMISSIONING']
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
        const { class_selected } = this.state;
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
                Header: 'Class',
                accessor: 'classifier',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } }),
                Cell: row => {
                    const displayed_text = this.getDisplayedClass(row.value);
                    return <span>{displayed_text}</span>;
                }
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
                            onClick={() =>
                                deleteClassClassifier(row.original.id)
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
                    newClassifier={newClassClassifier}
                    editClassifier={editClassClassifier}
                >
                    <div>
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
                    </div>
                </Editor>
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
