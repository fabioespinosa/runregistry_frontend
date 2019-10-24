import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Input, Button, InputNumber } from 'antd';
import Swal from 'sweetalert2';
import { reFetchDataset } from '../../../ducks/offline/datasets';
import { reFetchRun } from '../../../ducks/online/runs';
import { addLumisectionRange } from '../../../ducks/online/lumisections';
import BarPlot from './BarPlot';
import History from './History';
const { TextArea } = Input;

class EditComponent extends Component {
    constructor(props) {
        super(props);
        let { lumisection_ranges } = this.props;
        lumisection_ranges = lumisection_ranges || [];
        const ls_ranges_lengths = { title: 'LS' };
        lumisection_ranges.forEach(range => {
            const { start, end, status } = range;
            ls_ranges_lengths[`${start} - ${end}`] = end - start + 1;
        });

        this.state = {
            modifying: false,
            show_history: false,
            ls_ranges_lengths: [ls_ranges_lengths],
            lumisection_ranges
        };
    }
    render() {
        const {
            run_number,
            dataset_name,
            component,
            state,
            component_name
        } = this.props;
        const {
            modifying,
            show_history,
            lumisection_ranges,
            ls_ranges_lengths
        } = this.state;
        const number_of_lumisections = lumisection_ranges[
            lumisection_ranges.length - 1
        ]
            ? lumisection_ranges[lumisection_ranges.length - 1].end
            : 0;
        const initialValues = {
            start: number_of_lumisections === 0 ? 0 : 1,
            end: number_of_lumisections
        };
        const lumisections_with_comments = lumisection_ranges.filter(
            ({ comment }) =>
                typeof comment !== 'undefined' && comment.length > 0
        );
        return (
            <tr>
                <td>{component_name ? component_name : component}</td>
                <td className="comment">
                    {show_history ? (
                        <History
                            run_number={run_number}
                            dataset_name={dataset_name}
                            component={component}
                            number_of_lumisections={number_of_lumisections}
                        />
                    ) : (
                        <div>
                            <BarPlot
                                ls_ranges_lengths={ls_ranges_lengths}
                                lumisection_ranges={lumisection_ranges}
                            />
                            {lumisections_with_comments.length > 0 && (
                                <div>
                                    <h4>Comments:</h4>
                                    {lumisections_with_comments.map(
                                        ({ status, start, end, comment }) => (
                                            <div>
                                                Status:{' '}
                                                <strong>{status}</strong>
                                                {' - '}From LS:{' '}
                                                <strong>{start}</strong> to LS:{' '}
                                                <strong>{end}</strong>
                                                {' - '}Comment:{' '}
                                                <strong>{comment}</strong>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {modifying && (
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize={true}
                            onSubmit={async form_values => {
                                const { run_number, dataset_name } = this.props;
                                let component_triplet_name = component;
                                console.log(form_values);
                                await this.props.addLumisectionRange(
                                    form_values,
                                    run_number,
                                    dataset_name,
                                    component_triplet_name
                                );
                                await this.props.refreshLumisections();
                                await Swal(
                                    `Component's edited successfully`,
                                    '',
                                    'success'
                                );
                                if (dataset_name === 'online') {
                                    await this.props.reFetchRun(run_number);
                                } else {
                                    await this.props.reFetchDataset(
                                        run_number,
                                        dataset_name
                                    );
                                }
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
                                        <hr />
                                        <br />
                                        <h3>Edit Lumisections</h3>
                                        <br />
                                        <center>
                                            <i>Change status to: </i>
                                            <Field
                                                component="select"
                                                name="status"
                                            >
                                                <option value="">-----</option>
                                                <option value="GOOD">
                                                    GOOD
                                                </option>
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
                                            <br />
                                            <br />
                                            <i>Cause: </i>
                                            <Field
                                                key={component}
                                                component="select"
                                                name="cause"
                                                disabled
                                            />
                                            <br />
                                            <br />
                                            <i>From Lumisection: </i>
                                            <InputNumber
                                                name="end"
                                                value={start}
                                                min={1}
                                                max={number_of_lumisections}
                                                defaultValue={1}
                                                onChange={value =>
                                                    setFieldValue(
                                                        'start',
                                                        value
                                                    )
                                                }
                                            />{' '}
                                            &nbsp; <i>To Lumisection: </i>
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
                                            <br />
                                            <i>Comment: </i>
                                            <div className="text_area">
                                                <TextArea
                                                    name="comment"
                                                    onChange={value =>
                                                        setFieldValue(
                                                            'comment',
                                                            value.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <br />
                                            <div className="submit">
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
                                            </div>
                                        </center>
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
                            disabled={state !== 'OPEN'}
                        >
                            {state === 'OPEN'
                                ? 'Modify'
                                : 'State should be OPEN to modify components'}
                        </Button>
                    )}
                </td>
                <td className="history_toggle">
                    {show_history ? (
                        <div>
                            <Button
                                onClick={() =>
                                    this.setState({ show_history: false })
                                }
                            >
                                Hide history
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() =>
                                this.setState({ show_history: true })
                            }
                        >
                            Show History
                        </Button>
                    )}
                </td>
                <style jsx>{`
                    h3 {
                        text-decoration: underline;
                    }
                    form {
                        margin-top: 10px;
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
                    .submit {
                        text-align: center;
                    }

                    .text_area {
                        width: 80%;
                    }
                `}</style>
            </tr>
        );
    }
}

export default connect(
    null,
    { addLumisectionRange, reFetchDataset, reFetchRun }
)(EditComponent);
