import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button, Select, Input, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
const { Option } = Select;

import { copyDatasetColumn } from '../../../../ducks/offline/dc_tools';

class CopyDatasetColumn extends Component {
    state = { unique_dataset_names: [] };
    componentDidMount = error_handler(async () => {
        const { filter, workspace } = this.props;
        const { data: unique_dataset_names } = await axios.post(
            `${api_url}/dc_tools/unique_dataset_names`,
            {
                workspace: workspace.toLowerCase(),
                filter
            }
        );
        this.setState({ unique_dataset_names });
    });
    render() {
        const { datasets, count, filter, workspaces, workspace } = this.props;
        const { unique_dataset_names } = this.state;
        const initialValues = {};

        let columns = [];
        workspaces.forEach(
            ({ workspace: iterator_workspace, columns: iterator_columns }) => {
                if (
                    workspace.toLowerCase() === iterator_workspace.toLowerCase()
                ) {
                    columns = iterator_columns.map(
                        column => `${workspace.toLowerCase()}-${column}`
                    );
                }
            }
        );

        return (
            <div>
                <h3>
                    This tool will allow the DC Expert to copy certain columns
                    across datasets
                </h3>
                <h5 style={{ textAlign: 'center', color: 'red' }}>
                    {count} Datasets Selected
                </h5>
                <h5>
                    {Object.keys(filter).length === 0
                        ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
                        : `With filter: ${JSON.stringify(filter)}`}
                </h5>
                <br />
                {workspace === 'global' && (
                    <h1>
                        This action cannot be performed in GLOBAL workspace, it
                        must be done individually on each workspace
                    </h1>
                )}
                <Formik
                    initialValues={initialValues}
                    onSubmit={async values => {
                        // TODO: validation (all empty fields, ...)
                        values.columns_to_copy = [];
                        for (const [key, val] of Object.entries(values)) {
                            if (key.includes('columns*')) {
                                const column = key.split('columns*')[1];
                                if (val) {
                                    values.columns_to_copy.push(column);
                                }
                            }
                        }
                        await this.props.copyDatasetColumn(values);
                        await Swal(
                            `Datasets duplicated in the selected workspaces`,
                            '',
                            'success'
                        );
                    }}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        console.log(values);
                        return (
                            <form
                                onSubmit={handleSubmit}
                                className="dataset_copy_form"
                            >
                                <center>
                                    This tool serves as a way to copy a column
                                    (say pixel from tracker) from a specific
                                    dataset to the same column of another
                                    dataset. <br /> The classical use case is if
                                    a subsystem did a batch update of many
                                    datasets of a ReReco or UltraLegacy (UL) and
                                    now want to revert the change they made.{' '}
                                    <br />
                                    So we use this tool so that they can copy
                                    that column they changed back into what was
                                    the original PromptReco value
                                </center>
                                <div className="form_container">
                                    <br />
                                    Source dataset name (whose columns we want
                                    to copy from):
                                    <Select
                                        placeholder="Source dataset name"
                                        value={values['source_dataset_name']}
                                        onChange={value =>
                                            setFieldValue(
                                                'source_dataset_name',
                                                value
                                            )
                                        }
                                    >
                                        {unique_dataset_names.map(
                                            dataset_name => (
                                                <Option value={dataset_name}>
                                                    {dataset_name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                    <br />
                                    <br />
                                    Target dataset name (whose columns we want
                                    to copy to):
                                    <Select
                                        placeholder="Target dataset name"
                                        value={values['target_dataset_name']}
                                        onChange={value =>
                                            setFieldValue(
                                                'target_dataset_name',
                                                value
                                            )
                                        }
                                    >
                                        {unique_dataset_names.map(
                                            dataset_name => (
                                                <Option value={dataset_name}>
                                                    {dataset_name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                    <br />
                                    <br />
                                    Columns to copy from dataset
                                    <br />
                                    These columns all belong to the {
                                        workspace
                                    }{' '}
                                    workspace <br />
                                    <ul>
                                        {columns.map(column => (
                                            <li key={column}>
                                                <Checkbox
                                                    checked={
                                                        values[
                                                            `columns*${column}`
                                                        ]
                                                    }
                                                    onChange={({ target }) =>
                                                        setFieldValue(
                                                            `columns*${column}`,
                                                            target.checked
                                                        )
                                                    }
                                                >
                                                    {column.split('-')[1]}
                                                </Checkbox>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="buttons">
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        );
                    }}
                />
                <style jsx>{`
                    .form_container {
                        margin: 0 auto;
                        width: 400px;
                    }

                    ul {
                        list-style: none;
                        margin-left: 20px;
                    }

                    .buttons {
                        display: flex;
                        justify-content: flex-end;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { datasets, count, filter } = state.offline.editable_datasets;
    return {
        datasets,
        count,
        filter,
        workspaces: state.offline.workspace.workspaces,
        workspace: state.offline.workspace.workspace
    };
};

export default connect(mapStateToProps, { copyDatasetColumn })(
    CopyDatasetColumn
);
