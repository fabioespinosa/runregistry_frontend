import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Formik, Field } from 'formik';
import { Input, Button } from 'antd';

import { editRun } from '../../.././../../ducks/online/runs';
import { components } from '../../../../../config/config';
const { TextArea } = Input;
import EditClass from './editClass/EditClass';

class EditRun extends Component {
    render() {
        const { run, editRun } = this.props;

        const initialValues = {};
        for (const [key, val] of Object.entries(run)) {
            if (
                key.indexOf('triplet') > 0 &&
                val !== null &&
                typeof val === 'object'
            ) {
                // We are dealing now with a triplet:
                const { status, comment, cause } = val;
                initialValues[`${key}>status`] = status;
                initialValues[`${key}>cause`] = cause;
                initialValues[`${key}>comment`] = comment;
            }
            if (key === 'stop_reason') {
                initialValues['stop_reason'] = val.value;
            }
        }

        return (
            <div>
                <EditClass run={run} />
                <Formik
                    initialValues={initialValues}
                    onSubmit={async values => {
                        const components_triplets = {};
                        for (const [key, val] of Object.entries(values)) {
                            if (key.includes('_triplet')) {
                                const component_key = key.split('>')[0];
                                const triplet_key = key.split('>')[1];
                                components_triplets[component_key] = {
                                    ...components_triplets[component_key],
                                    [triplet_key]: val
                                };
                            }
                        }
                        console.log(values);
                        console.log(components_triplets);
                        await editRun(run.run_number, {
                            ...values,
                            ...components_triplets
                        });
                        await Swal(
                            `Run ${
                                run.run_number
                            } component's edited successfully`,
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
                            <div
                                style={{
                                    margin: '0 auto',
                                    width: '50%',
                                    display: 'flex'
                                }}
                            >
                                <label style={{ width: '154px' }}>
                                    <strong>Run stop reason:</strong>
                                </label>
                                <TextArea
                                    value={values['stop_reason']}
                                    onChange={evt =>
                                        setFieldValue(
                                            'stop_reason',
                                            evt.target.value
                                        )
                                    }
                                    name="stop_reason"
                                    row={1}
                                    type="text"
                                    autosize
                                />
                            </div>
                            <br />
                            <table className="edit_run_form">
                                <thead>
                                    <tr className="table_header">
                                        <td>Component</td>
                                        <td>Status</td>
                                        <td>Cause</td>
                                        <td>Comment</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {components.map(component => (
                                        <tr key={component}>
                                            <td>{component}</td>
                                            <td className="status_dropdown">
                                                <Field
                                                    key={component}
                                                    component="select"
                                                    name={`${component}_triplet>status`}
                                                >
                                                    <option value="GOOD">
                                                        GOOD
                                                    </option>
                                                    <option value="BAD">
                                                        BAD
                                                    </option>
                                                    <option value="STANDBY">
                                                        STANDBY
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
                                                            `${component}_triplet>comment`
                                                        ]
                                                    }
                                                    onChange={evt =>
                                                        setFieldValue(
                                                            `${component}_triplet>comment`,
                                                            evt.target.value
                                                        )
                                                    }
                                                    name={`${component}_triplet>comment`}
                                                    row={1}
                                                    type="text"
                                                    autosize
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="buttons">
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    )}
                />
                <style jsx>{`
                    .edit_run_form {
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

export default connect(
    null,
    { editRun }
)(EditRun);
