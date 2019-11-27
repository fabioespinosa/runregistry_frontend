import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button, Select, Input, Checkbox } from 'antd';
import Swal from 'sweetalert2';
const { Option } = Select;

import { datasetColumnBatchUpdate } from '../../../../ducks/offline/dc_tools';

class DatasetColumnBatchUpdate extends Component {
    render() {
        const { count, filter, workspaces, workspace } = this.props;
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
                    This tool will allow users to change columns of several
                    datasets at once.
                </h3>
                <p>
                    For example, setting to BAD the column of tracker-strips for
                    several datasets
                </p>
                <h5 style={{ textAlign: 'center', color: 'red' }}>
                    {count} Datasets Selected
                </h5>
                <h5>
                    {Object.keys(filter).length === 0
                        ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
                        : `With filter: ${JSON.stringify(filter)}`}
                </h5>
                <br />
                {workspace === 'global' ? (
                    <h3>
                        This action cannot be performed in GLOBAL workspace, it
                        must be done individually on each workspace
                    </h3>
                ) : (
                    <div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={async values => {
                                // TODO: validation (all empty fields, ...)
                                values.columns_to_update = [];
                                for (const [key, val] of Object.entries(
                                    values
                                )) {
                                    if (key.includes('columns*')) {
                                        const column = key.split('columns*')[1];
                                        if (val) {
                                            values.columns_to_update.push(
                                                column
                                            );
                                        }
                                    }
                                }
                                await this.props.datasetColumnBatchUpdate(
                                    values
                                );
                                await Swal(
                                    `Dataset's column(s) updated`,
                                    '',
                                    'success'
                                );
                            }}
                            render={({
                                values,
                                setFieldValue,
                                handleSubmit
                            }) => {
                                console.log(values);
                                return (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="dataset_copy_form"
                                    >
                                        <div className="form_container">
                                            <br />
                                            Columns to change status in batch
                                            <br />
                                            These columns all belong to the{' '}
                                            {workspace} workspace <br />
                                            <ul>
                                                {columns.map(column => (
                                                    <li key={column}>
                                                        <Checkbox
                                                            checked={
                                                                values[
                                                                    `columns*${column}`
                                                                ]
                                                            }
                                                            onChange={({
                                                                target
                                                            }) =>
                                                                setFieldValue(
                                                                    `columns*${column}`,
                                                                    target.checked
                                                                )
                                                            }
                                                        >
                                                            {
                                                                column.split(
                                                                    '-'
                                                                )[1]
                                                            }
                                                        </Checkbox>
                                                    </li>
                                                ))}
                                            </ul>
                                            <br />
                                            Change status to:
                                            <Select
                                                placeholder="Change status to"
                                                value={values['new_status']}
                                                onChange={value =>
                                                    setFieldValue(
                                                        'new_status',
                                                        value
                                                    )
                                                }
                                            >
                                                <Option value="GOOD">
                                                    GOOD
                                                </Option>
                                                <Option value="BAD">BAD</Option>
                                                <Option value="EXCLUDED">
                                                    EXCLUDED
                                                </Option>
                                                <Option value="STANDBY">
                                                    STANDBY
                                                </Option>
                                                <Option value="NOTSET">
                                                    NOTSET
                                                </Option>
                                            </Select>
                                            <br />
                                        </div>
                                        <div className="buttons">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </form>
                                );
                            }}
                        />
                    </div>
                )}

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
    const { count, filter } = state.offline.editable_datasets;
    return {
        count,
        filter,
        workspaces: state.offline.workspace.workspaces,
        workspace: state.offline.workspace.workspace
    };
};

export default connect(mapStateToProps, { datasetColumnBatchUpdate })(
    DatasetColumnBatchUpdate
);
