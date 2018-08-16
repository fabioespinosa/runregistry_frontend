import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Input, Button } from 'antd';

import { components } from '../../../../../config/config';
const { TextArea } = Input;

class EditRun extends Component {
    render() {
        const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            run
        } = this.props;

        const initialValues = {};
        for (const [key, val] of Object.entries(run)) {
            if (
                key.indexOf('triplet') > 0 &&
                val !== null &&
                typeof val === 'object'
            ) {
                // We are dealing now with a triplet:
                const { status, comment, cause } = val;
                initialValues[`${key}_status`] = status;
                initialValues[`${key}_cause`] = cause;
                initialValues[`${key}_comment`] = comment;
            }
        }
        // Object.keys(run).forEach(component => {
        //     const triplet = run[component];
        //     if (component !== null && key.indexOf('') typeof triplet === 'object' ) {
        //         initialValues[`${component}_status`] = run[component].status;
        //         initialValues[`${component}_cause`] = dataset[component].cause;
        //         initialValues[`${component}_comment`] =
        //             dataset[component].comment;
        //     }
        // });
        console.log(initialValues);
        return (
            <div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={evt => {
                        console.log(evt);
                    }}
                    render={props => (
                        <form onSubmit={props.handleSubmit}>
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
                                                    name={`${component}_triplet_status`}
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
                                                    name={`${component}_triplet_comment`}
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
                                <Button type="">Cancel</Button>
                                <Button type="">Reset</Button>
                                <Button type="primary">Save</Button>
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

                    .buttons * {
                    }
                `}</style>
            </div>
        );
    }
}

export default EditRun;
