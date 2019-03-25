import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Select, Input, Button, InputNumber } from 'antd';
import Swal from 'sweetalert2';
import { addLumisectionRange } from '../../../../../ducks/online/lumisections';
import BarPlot from './BarPlot';
const { TextArea } = Input;
const { Option, OptGroup } = Select;

class EditComponent extends Component {
    constructor(props) {
        super(props);
        const { lumisection_ranges, component } = this.props;
        // Filter the lumisections corresponding to this component:

        const ls_ranges_lengths = { title: 'LS' };

        lumisection_ranges.forEach(range => {
            const { start, end, status } = range;
            ls_ranges_lengths[`${start} - ${end}`] = end - start + 1;
        });

        this.state = {
            modifying: false,
            ls_ranges_lengths: [ls_ranges_lengths],
            lumisection_ranges
        };
    }
    render() {
        const { component } = this.props;
        const { modifying, lumisection_ranges, ls_ranges_lengths } = this.state;
        const number_of_lumisections =
            lumisection_ranges[lumisection_ranges.length - 1].end;
        const initialValues = {
            start: 1,
            end: number_of_lumisections
        };
        return (
            <tr key={component}>
                <td>{component}</td>
                <td className="comment">
                    <BarPlot
                        ls_ranges_lengths={ls_ranges_lengths}
                        lumisection_ranges={lumisection_ranges}
                    />
                    {modifying && (
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize={true}
                            onSubmit={async form_values => {
                                const { run_number, dataset_name } = this.props;
                                const component_triplet_name = `${component}_triplet`;
                                console.log(form_values);
                                await this.props.addLumisectionRange(
                                    form_values,
                                    run_number,
                                    dataset_name,
                                    component_triplet_name
                                );
                                await this.props.refreshLumisections();
                                await Swal(
                                    `Run ${run_number} component's edited successfully`,
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
                            }) => {
                                const { status, start, end } = values;
                                return (
                                    <form>
                                        Change status to:{' '}
                                        <Field
                                            key={component}
                                            component="select"
                                            name="status"
                                        >
                                            <option value="">-----</option>
                                            <option value="GOOD">GOOD</option>
                                            <option value="BAD">BAD</option>
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
                                        Cause:
                                        <Field
                                            key={component}
                                            component="select"
                                            name="cause"
                                            disabled
                                        />
                                        <br />
                                        From Lumisection:
                                        <InputNumber
                                            name="end"
                                            value={start}
                                            min={1}
                                            max={number_of_lumisections}
                                            defaultValue={1}
                                            onChange={value =>
                                                setFieldValue('start', value)
                                            }
                                        />
                                        To Lumisection:
                                        <InputNumber
                                            name="start"
                                            value={end}
                                            min={1}
                                            max={number_of_lumisections}
                                            defaultValue={
                                                number_of_lumisections
                                            }
                                            onChange={value =>
                                                setFieldValue('end', value)
                                            }
                                        />
                                        <br />
                                        Comment:
                                        <TextArea name="comment" />
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                handleSubmit();
                                                // this.setState({
                                                //     modifying: false
                                                // });
                                            }}
                                        >
                                            Modify
                                        </Button>
                                    </form>
                                );
                            }}
                        />
                    )}
                </td>
                <td className="modify_toggle">
                    {modifying ? (
                        <div>
                            <Button
                                onClick={() =>
                                    this.setState({
                                        modifying: false
                                    })
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() =>
                                this.setState({
                                    modifying: true
                                })
                            }
                        >
                            Modify
                        </Button>
                    )}
                </td>
                <style jsx>{`
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
                        width: 800px;
                    }
                    .lumisection_slider {
                        width: 200px;
                    }
                    .modify_toggle {
                        width: 180px;
                    }

                    .buttons {
                        display: flex;
                        justify-content: flex-end;
                    }
                `}</style>
            </tr>
        );
    }
}

export default connect(
    null,
    { addLumisectionRange }
)(EditComponent);
