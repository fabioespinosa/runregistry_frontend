import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import { Select, Icon } from 'antd';
import Swal from 'sweetalert2';
import {
    fetchComponentClassifiers,
    deleteComponentClassifier,
    editComponentClassifier,
    newComponentClassifier
} from '../../../ducks/offline/classifiers/component';
import {
    hideJsonEditor,
    editClassifierIntent,
    changeJsonEditorValue
} from '../../../ducks/classifier_editor';

import stringify from 'json-stringify-pretty-compact';
const { Option } = Select;

const Editor = dynamic(import('../ClassifierEditor/ClassifierEditor'), {
    ssr: false
});

class ComponentClassifierConfiguration extends Component {
    constructor(props) {
        super(props);
        const { columns_of_workspace, current_workspace } = props;
        if (current_workspace !== 'global') {
            this.state = {
                // A Workspace MUST have at least 1 column (global workspace is the only one that is allowed to have no columns because it is just a view inside the selected workspace columns (i.e. csc-csc, or tracker-strips, tracker-pixel) )
                selected_component: columns_of_workspace[0],
                status_selected: 'GOOD',
                is_editing: false
            };
        }
    }
    componentDidMount() {
        const { current_workspace } = this.props;
        if (current_workspace !== 'global') {
            const { selected_component } = this.state;
            this.props.fetchComponentClassifiers(selected_component.id);
        }
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

    changeComponent = component_id => {
        this.props.hideJsonEditor();
        this.props.fetchComponentClassifiers(component_id);
        const selected_component = this.props.columns_of_workspace.find(
            ({ id }) => id === +component_id
        );
        this.setState({ selected_component });
    };

    render() {
        const { current_workspace } = this.props;
        if (current_workspace.toLowerCase() === 'global') {
            return (
                <div>
                    Global workspace has no component classifiers. The global
                    workspace is just a view inside the selected columns of each
                    workspace, like csc inside csc, or pixel inside tracker.
                    <br />
                    If you want to edit the component classifier of a column
                    inside the global workspace you should go to the respective
                    workspace and edit the component classifier inside it
                </div>
            );
        }
        const {
            newComponentClassifier,
            editComponentClassifier,
            editClassifierIntent,
            changeJsonEditorValue,
            deleteComponentClassifier,
            classifiers,
            columns_of_workspace
        } = this.props;
        const { selected_component, status_selected } = this.state;

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
            {
                Header: 'Priority',
                accessor: 'priority',
                width: 80
            },
            { Header: 'Updated at', accessor: 'createdAt', width: 100 },
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
        const components_options = columns_of_workspace.map(({ id, name }) => (
            <Option key={id}>{name}</Option>
        ));

        return (
            <div>
                Workspace: <strong>{current_workspace}</strong>,{' '}
                <label htmlFor="status_select">column:</label>
                &nbsp;
                <Select
                    id="component_select"
                    defaultValue={selected_component.name}
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
                            selected_component.id
                        )
                    }
                    onCancel={() => this.setState({ is_editing: false })}
                >
                    <div>
                        For column: <strong>{selected_component.name}</strong>.
                        <label> (To change the column, change it above)</label>
                        <br />
                        <br />
                        <label htmlFor="status_select">Status:</label>
                        &nbsp;
                        <Select
                            id="status_select"
                            value={status_selected}
                            onChange={value =>
                                this.setState({
                                    status_selected: value
                                })
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
const mapStateToProps = (state, ownProps) => {
    const { online_or_offline } = ownProps;
    const workspaces = state[online_or_offline].workspace.workspaces;
    const current_workspace = state[
        online_or_offline
    ].workspace.workspace.toLowerCase();
    // We find the columns of the current workspace:

    const current_workspace_info = workspaces.find(
        ({ workspace }) => workspace === current_workspace
    );
    let columns_of_workspace = [];
    if (current_workspace !== 'global') {
        columns_of_workspace = current_workspace_info.columns_with_id;
    }

    return {
        classifiers: state[online_or_offline].classifiers.component,
        current_workspace,
        columns_of_workspace,
        workspaces
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
