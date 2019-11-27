import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Button, Checkbox } from 'antd';
import { certifiable_offline_components } from '../../../../config/config';

import { exportToCSV } from '../../../../ducks/offline/dc_tools';

class ExportToCSV extends Component {
    state = { unique_dataset_names: [] };

    downloadCSV = async values => {
        // TODO: validation (all empty fields, ...)
        const columns_to_export = [];
        for (const [key, val] of Object.entries(values)) {
            if (key.includes('columns*')) {
                const column = key.split('columns*')[1];
                if (val) {
                    columns_to_export.push(column);
                }
            }
        }

        const datasets_csv = await this.props.exportToCSV(columns_to_export);
        // Make browser download CSV
        const csvData = new Blob([datasets_csv], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvData);
        const hiddenElement = document.createElement('a');
        hiddenElement.href = csvUrl;
        hiddenElement.target = '_blank';
        hiddenElement.download = 'datasets.csv';
        hiddenElement.click();
    };

    render() {
        const { count, filter, workspaces, workspace } = this.props;
        const initialValues = {};

        let columns = [];
        if (workspace === 'global') {
            for (const [workspace_name, certifiable_columns] of Object.entries(
                certifiable_offline_components
            )) {
                certifiable_columns.forEach(column => {
                    columns.push(`${workspace_name}-${column}`);
                });
            }
        } else {
            workspaces.forEach(
                ({
                    workspace: iterator_workspace,
                    columns: iterator_columns
                }) => {
                    if (
                        workspace.toLowerCase() ===
                        iterator_workspace.toLowerCase()
                    ) {
                        columns = iterator_columns.map(
                            column => `${workspace.toLowerCase()}-${column}`
                        );
                    }
                }
            );
        }

        return (
            <div>
                <h3>
                    This tool will allow the user to export the results on the
                    table to a CSV file (DOES NOT WORK IN INTERNET EXPLORER)
                </h3>
                <h5 style={{ textAlign: 'center', color: 'red' }}>
                    {count} Datasets Selected
                </h5>
                <h5>
                    {Object.keys(filter).length === 0
                        ? `WARNING: NO FILTER, EXPORTING ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
                        : `With filter: ${JSON.stringify(filter)}`}
                </h5>
                <br />
                <Formik
                    initialValues={initialValues}
                    onSubmit={this.downloadCSV}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        return (
                            <form
                                onSubmit={handleSubmit}
                                className="dataset_copy_form"
                            >
                                <div className="form_container">
                                    <br />
                                    Columns to export
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
                                        Download
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
    const { count, filter } = state.offline.editable_datasets;
    return {
        count,
        filter,
        workspaces: state.offline.workspace.workspaces,
        workspace: state.offline.workspace.workspace
    };
};

export default connect(mapStateToProps, { exportToCSV })(ExportToCSV);
