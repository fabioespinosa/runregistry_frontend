import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Formik, Field } from 'formik';
import { Input, Button } from 'antd';
import { offline_columns } from '../../../../../config/config';

import { editDataset } from '../../../../../ducks/offline/datasets';
import { components } from '../../../../../config/config';
const { TextArea } = Input;
import EditClass from './editClass/EditClass';

class EditDataset extends Component {
    render() {
        const { dataset, workspace, editDataset } = this.props;

        const initialValues = {};
        let offline_columns_composed = offline_columns.filter(column => {
            if (workspace === 'global') {
                return !column.includes('_');
            }
            return column.startsWith(workspace.toLowerCase());
        });

        offline_columns_composed.forEach(column => {
            if (
                column !== 'run_number' ||
                column !== 'name' ||
                column !== 'state' ||
                column !== 'createdAt'
            ) {
                const { status, comment, cause } = dataset[column];
                initialValues[`${column}>status`] = status;
                initialValues[`${column}>cause`] = cause;
                initialValues[`${column}>comment`] = comment;
            }
        });
        return (
            <div>
                {dataset[`${workspace.toLowerCase()}_state`]['value'] ===
                'OPEN' ? (
                    <div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={async values => {
                                const components_triplets = {};
                                for (const [key, val] of Object.entries(
                                    values
                                )) {
                                    const component_key = key.split('>')[0];
                                    const triplet_key = key.split('>')[1];
                                    // Put it again in format component:triplet
                                    components_triplets[component_key] = {
                                        ...components_triplets[component_key],
                                        [triplet_key]: val
                                    };
                                }
                                const { run_number, name } = dataset;
                                await editDataset(
                                    `${run_number}_${name}`,
                                    components_triplets
                                );
                                await Swal(
                                    `Dataset ${`${run_number}_${name}`} component's edited successfully`,
                                    '',
                                    'success'
                                );
                            }}
                            render={({
                                values,
                                setFieldValue,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <table className="edit_dataset_form">
                                        <thead>
                                            <tr className="table_header">
                                                <td>Component</td>
                                                <td>Status</td>
                                                <td>Cause</td>
                                                <td>Comment</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {offline_columns_composed.map(
                                                component => (
                                                    <tr key={component}>
                                                        <td>{component}</td>
                                                        <td className="status_dropdown">
                                                            <Field
                                                                key={component}
                                                                component="select"
                                                                name={`${component}>status`}
                                                            >
                                                                <option value="GOOD">
                                                                    GOOD
                                                                </option>
                                                                <option value="BAD">
                                                                    BAD
                                                                </option>
                                                            </Field>
                                                        </td>
                                                        <td className="cause_dropdown">
                                                            <Field
                                                                key={component}
                                                                component="select"
                                                                name={component}
                                                                disabled
                                                            >
                                                                <option value="undef">
                                                                    undef
                                                                </option>
                                                                <option value="other">
                                                                    other
                                                                </option>
                                                            </Field>
                                                        </td>
                                                        <td className="comment">
                                                            <TextArea
                                                                value={
                                                                    values[
                                                                        `${component}>comment`
                                                                    ]
                                                                }
                                                                onChange={evt =>
                                                                    setFieldValue(
                                                                        `${component}>comment`,
                                                                        evt
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                name={`${component}>comment`}
                                                                row={1}
                                                                type="text"
                                                                autosize
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="buttons">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            )}
                        />
                    </div>
                ) : (
                    <div>
                        In order to edit a dataset's class or change component's
                        status, the dataset's state{' '}
                        <i style={{ textDecoration: 'underline' }}>
                            must be moved to OPEN
                        </i>
                        . <br /> <br />
                        You can mark a dataset's state OPEN by clicking 'move'
                        in the table (Although this process is automatic)
                        <br />
                        <br />A dataset is marked as OPEN and shown in the
                        EDITABLE datasets automatically as soon as it appears in
                        DQM GUI (and passess the dataset classifier test, see
                        configuration -> dataset classifier) If you are sure
                        this run has already appeared in DQM GUI, or you have
                        reasons to edit it's status now) please change the
                        status .
                    </div>
                )}

                <style jsx>{`
                    .edit_dataset_form {
                        margin: 0 auto;
                        text-align: center;
                        border: 1px solid grey;
                    }
                    thead {
                        border-bottom: 3px solid grey;
                        text-align: center;
                    }
                    tr > td {
                        padding: 8px 5px;
                    }
                    tr:not(:last-child) {
                        border-bottom: 1px solid grey;
                    }

                    tr > td :not(:last-child) {
                        border-right: 0.5px solid grey;
                    }

                    th {
                        text-align: center;
                    }

                    th > td:not(:last-child) {
                        border-right: 0.5px solid grey;
                        padding-right: 5px;
                    }
                    .comment {
                        width: 500px;
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
    return {
        workspace: state.offline.workspace.workspace
    };
};

export default connect(
    mapStateToProps,
    { editDataset }
)(EditDataset);
