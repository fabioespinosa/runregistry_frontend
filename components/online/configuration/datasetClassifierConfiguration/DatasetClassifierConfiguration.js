import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import { Select, Icon } from 'antd';
import {
    fetchDatasetClassifiers,
    deleteDatasetClassifier,
    editDatasetClassifier,
    newDatasetClassifier
} from '../../../../ducks/online/classifiers/dataset';
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
    state = { class_selected: 'COLLISSIONS' };
    componentDidMount() {
        this.props.fetchDatasetClassifiers(this.state.component);
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
        const {
            newDatasetClassifier,
            editDatasetClassifier,
            editClassifierIntent,
            changeJsonEditorValue,
            deleteDatasetClassifier,
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
                Header: 'Class',
                accessor: 'class',
                width: 90,
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
                                deleteDatasetClassifier(row.original.id)
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
                <p>Current Dataset Classifier criteria:</p>
                <ReactTable
                    columns={columns}
                    data={classifiers}
                    defaultPageSize={10}
                    showPagination={classifiers.length > 10}
                    optionClassName="react-table"
                />
                <Editor
                    formatClassifierCorrectly={this.formatClassifierCorrectly}
                    editClassifier={valid_js_object =>
                        editDatasetClassifier(valid_js_object, class_selected)
                    }
                    newClassifier={valid_js_object =>
                        newDatasetClassifier(valid_js_object, class_selected)
                    }
                >
                    <div>
                        <label htmlFor="class_select">For class:</label>
                        &nbsp;
                        <Select
                            name=""
                            id="class_select"
                            defaultValue={class_selected}
                            onChange={value =>
                                this.setState({ class_selected: value })
                            }
                        >
                            <Option value="cosmics">cosmics</Option>
                            <Option value="collisions">collissions</Option>
                            <Option value="commissioning">commissioning</Option>
                        </Select>
                    </div>
                </Editor>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        classifiers: state.online.classifiers.dataset
    };
};

export default connect(
    mapStateToProps,
    {
        fetchDatasetClassifiers,
        deleteDatasetClassifier,
        editDatasetClassifier,
        newDatasetClassifier,
        changeJsonEditorValue,
        editClassifierIntent
    }
)(DatasetClassifierConfiguration);
