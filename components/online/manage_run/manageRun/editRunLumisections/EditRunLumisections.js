import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Formik, Field } from 'formik';
import { Select, Input, Button } from 'antd';
import axios from 'axios';
import { api_url } from '../../../../../config/config';
import { editRun, refreshRun } from '../../../../../ducks/online/runs';
import { showManageRunModal } from '../../../../../ducks/online/ui';
import { components } from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';
const { TextArea } = Input;
const { Option, OptGroup } = Select;

class EditRun extends Component {
    state = { classes: [], not_in_the_list: false };
    componentDidMount = error_handler(async () => {
        const { data: class_classifiers } = await axios.get(
            `${api_url}/classifiers/class`
        );
        const classes = class_classifiers.map(classifier => classifier.class);
        this.setState({
            classes
        });
    });
    render() {
        const { run, editRun } = this.props;
        const original_class = run.class.value;
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
            if (key === 'class') {
                initialValues['class'] = val.value;
            }
            if (key === 'stop_reason') {
                initialValues['stop_reason'] = val.value;
            }
        }
        return (
            <div>
                {run.significant ? (
                    <div>
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize={true}
                            onSubmit={async values => {
                                const components_triplets = {};
                                for (const [key, val] of Object.entries(
                                    values
                                )) {
                                    if (key.includes('_triplet')) {
                                        const component_key = key.split('>')[0];
                                        const triplet_key = key.split('>')[1];
                                        components_triplets[component_key] = {
                                            ...components_triplets[
                                                component_key
                                            ],
                                            [triplet_key]: val
                                        };
                                    }
                                }

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
                                            <strong>Class:</strong>
                                        </label>
                                        {this.state.not_in_the_list && (
                                            <div>
                                                Please write the class manually
                                                here:
                                                <TextArea
                                                    value={values['class']}
                                                    onChange={evt =>
                                                        setFieldValue(
                                                            'class',
                                                            evt.target.value
                                                        )
                                                    }
                                                    name="class"
                                                    type="text"
                                                    autosize
                                                />
                                                <Button
                                                    onClick={() =>
                                                        this.setState({
                                                            not_in_the_list: false
                                                        })
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                        {!this.state.not_in_the_list && (
                                            <Select
                                                value={values['class']}
                                                onChange={value => {
                                                    if (
                                                        value ===
                                                        'not_in_the_list'
                                                    ) {
                                                        this.setState({
                                                            not_in_the_list: true
                                                        });
                                                    } else {
                                                        setFieldValue(
                                                            'class',
                                                            value
                                                        );
                                                    }
                                                }}
                                            >
                                                <OptGroup label="Run possible classes:">
                                                    {this.state.classes.map(
                                                        current_class => (
                                                            <Option
                                                                key={
                                                                    current_class
                                                                }
                                                                value={
                                                                    current_class
                                                                }
                                                            >
                                                                {current_class}
                                                            </Option>
                                                        )
                                                    )}
                                                </OptGroup>
                                                <OptGroup label="Current class:">
                                                    <Option
                                                        key="disabled"
                                                        disabled
                                                    >
                                                        {original_class}
                                                    </Option>
                                                </OptGroup>
                                                <OptGroup label="Input another class:">
                                                    <Option
                                                        key="other"
                                                        value="not_in_the_list"
                                                    >
                                                        <i>
                                                            The class is not in
                                                            the list
                                                        </i>
                                                    </Option>
                                                </OptGroup>
                                            </Select>
                                        )}
                                    </div>
                                    <br />
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
                                    <div
                                        style={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Button
                                            onClick={async evt => {
                                                const { value } = await Swal({
                                                    type: 'warning',
                                                    title: `If a status was previously edited by a shifter, it will not be updated, it will only change those untouched.`,
                                                    text: '',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Yes',
                                                    reverseButtons: true
                                                });
                                                if (value) {
                                                    const updated_run = await this.props.refreshRun(
                                                        run.run_number
                                                    );
                                                    await this.props.showManageRunModal(
                                                        updated_run
                                                    );
                                                }
                                            }}
                                            type="primary"
                                        >
                                            Manually refresh component's
                                            statuses
                                        </Button>
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
                                                            <option value="">
                                                                -----
                                                            </option>
                                                            <option value="GOOD">
                                                                GOOD
                                                            </option>
                                                            <option value="BAD">
                                                                BAD
                                                            </option>
                                                            <option value="STANDBY">
                                                                STANDBY
                                                            </option>
                                                            <option value="EXCLUDED">
                                                                EXCLUDED
                                                            </option>
                                                            <option value="NOTSET">
                                                                NOTSET
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
                                                                    evt.target
                                                                        .value
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
                        In order to edit a run's lumisections the run{' '}
                        <i style={{ textDecoration: 'underline' }}>
                            must be marked significant first
                        </i>
                        . <br /> <br />
                        You can mark a run significant by clicking 'make
                        significant' in the table
                        <br />
                        <br />A run is marked as significant automatically if
                        during the run a certain number of events is reached, so
                        it is possible that RR automatically marks this run as
                        significant later on. If you are sure this run is
                        significant please mark it significant manually.
                    </div>
                )}
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
    { editRun, refreshRun, showManageRunModal }
)(EditRun);
