import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button, Select, Input, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
const { Option } = Select;

import { duplicateDatasets } from '../../../../ducks/offline/dc_tools';

class DuplicateDatasets extends Component {
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
        const { datasets, count, filter, workspaces } = this.props;
        const { unique_dataset_names } = this.state;
        const initialValues = {};
        // By default all workspaces start being true:
        workspaces.forEach(({ workspace }) => {
            initialValues[`workspaces-${workspace}`] = true;
        });
        return (
            <div>
                <h3>
                    This tool will allow the DC Expert to duplicate datasets
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
                <Formik
                    initialValues={initialValues}
                    onSubmit={async values => {
                        // TODO: validation (empty fields, ...)
                        values.target_dataset_name = values.target_dataset_name.trim();
                        values.workspaces = [];
                        for (const [key, val] of Object.entries(values)) {
                            if (key.includes('workspaces-')) {
                                const workspace = key.split('workspaces-')[1];
                                if (val) {
                                    values.workspaces.push(workspace);
                                }
                            }
                        }
                        await this.props.duplicateDatasets(values);
                        await Swal(
                            `Datasets duplicated in the selected workspaces`,
                            '',
                            'success'
                        );
                    }}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        return (
                            <form
                                onSubmit={handleSubmit}
                                className="dataset_copy_form"
                            >
                                <div className="form_container">
                                    Tip:Selecting 'online' will duplicate the
                                    original dataset as it came from P5, without
                                    any LS alteration afterwards.
                                    <br />
                                    <br />
                                    Source dataset name:
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
                                                <Option
                                                    key={dataset_name}
                                                    value={dataset_name}
                                                >
                                                    {dataset_name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                    <br />
                                    <br />
                                    Target dataset name:
                                    <Input
                                        value={values['target_dataset_name']}
                                        onChange={evt =>
                                            setFieldValue(
                                                'target_dataset_name',
                                                evt.target.value
                                            )
                                        }
                                        type="text"
                                    />
                                    <br />
                                    <br />
                                    Workspaces to copy dataset into:
                                    <ul>
                                        {workspaces.map(({ workspace }) => (
                                            <li key={workspace}>
                                                <Checkbox
                                                    checked={
                                                        values[
                                                            `workspaces-${workspace}`
                                                        ]
                                                    }
                                                    onChange={({ target }) =>
                                                        setFieldValue(
                                                            `workspaces-${workspace}`,
                                                            target.checked
                                                        )
                                                    }
                                                >
                                                    {workspace}
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
        workspace: state.offline.workspace.workspace,
        workspaces: state.offline.workspace.workspaces
    };
};

export default connect(mapStateToProps, { duplicateDatasets })(
    DuplicateDatasets
);
