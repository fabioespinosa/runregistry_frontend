import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import { Select, Icon } from 'antd';
import Swal from 'sweetalert2';
import { components } from '../../../../config/config';
import {
    fetchComponentClassifiers,
    deleteComponentClassifier,
    editComponentClassifier,
    newComponentClassifier
} from '../../../../ducks/online/classifiers/component';
import {
    hideJsonEditor,
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

class ComponentClassifierConfiguration extends Component {
    state = { component: 'cms', status_selected: 'GOOD', is_editing: false };
    componentDidMount() {
        this.props.fetchComponentClassifiers(this.state.component);
    }

    getDisplayedClassifier(classifier) {
        if (typeof classifier === 'string') {
            classifier = JSON.parse(classifier);
        }
        const displayed_text = classifier.if[0];
        return stringify(displayed_text);
    }

    formatClassifierCorrectly = inside_input => {
        const { status_selected } = this.state;
        const parsed_input = JSON.parse(inside_input);
        let classifier = {
            if: [parsed_input, true, false]
        };
        return classifier;
    };

    changeComponent = component => {
        this.props.hideJsonEditor();
        this.props.fetchComponentClassifiers(component);
        this.setState({ component });
    };

    render() {
        const {
            newComponentClassifier,
            editComponentClassifier,
            editClassifierIntent,
            changeJsonEditorValue,
            deleteComponentClassifier,
            classifiers
        } = this.props;
        const { component, status_selected } = this.state;
        const columns = [
            {
                Header: 'Priority',
                accessor: 'priority',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Status',
                accessor: 'status',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Component',
                accessor: 'component',
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
                                this.setState({
                                    status_selected: row.original.status,
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
                                        'Are you sure you want to delete this component classifier',
                                    text: '',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes',
                                    reverseButtons: true
                                });
                                if (value) {
                                    await deleteComponentClassifier(
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
        const components_options = components.map(component => (
            <Option key={component}>{component}</Option>
        ));
        return (
            <div>
                <label htmlFor="status_select">Component:</label>
                &nbsp;
                <Select
                    id="component_select"
                    defaultValue={component}
                    onChange={this.changeComponent}
                >
                    {components_options}
                </Select>
                <br />
                <br />
                <ReactTable
                    columns={columns}
                    data={classifiers}
                    defaultPageSize={10}
                    showPagination={classifiers.length > 10}
                    optionClassName="react-table"
                />
                <Editor
                    formatClassifierCorrectly={this.formatClassifierCorrectly}
                    editClassifier={editComponentClassifier}
                    newClassifier={valid_js_object =>
                        newComponentClassifier(
                            valid_js_object,
                            status_selected,
                            component
                        )
                    }
                    onCancel={() => this.setState({ is_editing: false })}
                >
                    <div>
                        For component: <strong>{component}</strong>.
                        <label>
                            {' '}
                            (To change the component, change it above)
                        </label>
                        <br />
                        <br />
                        <label htmlFor="status_select">Class:</label>
                        &nbsp;
                        <Select
                            id="status_select"
                            value={status_selected}
                            onChange={value =>
                                this.setState({ status_selected: value })
                            }
                            disabled={this.state.is_editing}
                        >
                            <Option value="GOOD">GOOD</Option>
                            <Option value="BAD">BAD</Option>
                            <Option value="STANDBY">STANDBY</Option>
                            <Option value="EXCLUDED">EXCLUDED</Option>
                            <Option value="NOTSET">NOT SET</Option>
                        </Select>
                    </div>
                </Editor>
                <style jsx>{`
                    .status_select {
                        width: 500px;
                    }
                `}</style>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        classifiers: state.online.classifiers.component
    };
};

export default connect(
    mapStateToProps,
    {
        hideJsonEditor,
        fetchComponentClassifiers,
        deleteComponentClassifier,
        editComponentClassifier,
        newComponentClassifier,
        changeJsonEditorValue,
        editClassifierIntent
    }
)(ComponentClassifierConfiguration);
