import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Formik, Field } from 'formik';
import { Select, Input, Button, Slider } from 'antd';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { api_url } from '../../../../../config/config';
import { editRun, refreshRun } from '../../../../../ducks/online/runs';
import { showManageRunModal } from '../../../../../ducks/online/ui';
import { components } from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const formatLegend = (value, entry, summary) => {
    const count = summary[value] ? summary[value] : 0;
    const style = {};
    if (count > 0) {
        style.fontWeight = 900;
        style.textDecoration = 'underline';
    }
    return (
        <span style={style}>
            {value}({count})
        </span>
    );
};

class EditRun extends Component {
    state = { classes: [], not_in_the_list: false, lumisections: [] };
    componentDidMount = error_handler(async () => {
        const { data: lumisections } = await axios.post(
            `${api_url}/datasets_get_lumisections`,
            {
                name: 'online',
                run_number: this.props.run.run_number
            }
        );
        this.setState({ lumisections });
    });
    render() {
        const { run, editRun } = this.props;
        const initialValues = {};
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
                                                <td>Lumisections</td>
                                                <td>Modify</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {components.map(component => {
                                                const lumisections = this.state.lumisections.map(
                                                    (lumisection, index) => {
                                                        let ls_data;
                                                        for (const [
                                                            key,
                                                            val
                                                        ] of Object.entries(
                                                            lumisection
                                                        )) {
                                                            const possible_component = key.split(
                                                                '_'
                                                            )[0];
                                                            if (
                                                                possible_component ===
                                                                component
                                                            ) {
                                                                ls_data = {
                                                                    name:
                                                                        index +
                                                                        1,
                                                                    [val.status]: 1
                                                                };
                                                            }
                                                        }
                                                        return ls_data;
                                                    }
                                                );
                                                return (
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
                                                            {this.state
                                                                .modifying ===
                                                            component ? (
                                                                <TextArea
                                                                    value={
                                                                        values[
                                                                            `${component}_triplet>comment`
                                                                        ]
                                                                    }
                                                                    onChange={evt =>
                                                                        setFieldValue(
                                                                            `${component}_triplet>comment`,
                                                                            evt
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    name={`${component}_triplet>comment`}
                                                                    row={1}
                                                                    type="text"
                                                                    autosize
                                                                />
                                                            ) : (
                                                                <BarChart
                                                                    barCategoryGap={
                                                                        -1
                                                                    }
                                                                    width={400}
                                                                    height={80}
                                                                    data={
                                                                        lumisections
                                                                    }
                                                                    margin={{
                                                                        top: 10,
                                                                        right: 30,
                                                                        left: 20,
                                                                        bottom: 10
                                                                    }}
                                                                >
                                                                    <CartesianGrid strokeDasharray="3 3" />
                                                                    <XAxis
                                                                        dataKey="name"
                                                                        interval="preserveStartEnd"
                                                                    />
                                                                    <Tooltip
                                                                        separator=""
                                                                        formatter={(
                                                                            value,
                                                                            name
                                                                        ) => ''}
                                                                    />

                                                                    <Bar
                                                                        isAnimationActive={
                                                                            false
                                                                        }
                                                                        dataKey="BAD"
                                                                        stackId="a"
                                                                        fill="red"
                                                                    />
                                                                    <Bar
                                                                        isAnimationActive={
                                                                            false
                                                                        }
                                                                        dataKey="GOOD"
                                                                        stackId="a"
                                                                        fill="green"
                                                                    />
                                                                    <Bar
                                                                        isAnimationActive={
                                                                            false
                                                                        }
                                                                        dataKey="STANDBY"
                                                                        stackId="a"
                                                                        fill="yellow"
                                                                    />
                                                                    <Bar
                                                                        isAnimationActive={
                                                                            false
                                                                        }
                                                                        dataKey="EXCLUDED"
                                                                        stackId="a"
                                                                        fill="grey"
                                                                    />
                                                                    <Bar
                                                                        isAnimationActive={
                                                                            false
                                                                        }
                                                                        dataKey="NOTSET"
                                                                        stackId="a"
                                                                        fill="black"
                                                                    />
                                                                    <Bar
                                                                        isAnimationActive={
                                                                            false
                                                                        }
                                                                        dataKey="EMPTY"
                                                                        stackId="a"
                                                                        fill="silver"
                                                                    />
                                                                </BarChart>
                                                            )}
                                                        </td>
                                                        <td className="lumisection_slider">
                                                            <Slider
                                                                defaultValue={[
                                                                    30,
                                                                    40
                                                                ]}
                                                                range
                                                                tooltipVisible
                                                            />
                                                        </td>
                                                        <td className="modify_toggle">
                                                            {this.state
                                                                .modifying ===
                                                            component ? (
                                                                <div>
                                                                    <Button
                                                                        onClick={() =>
                                                                            this.setState(
                                                                                {
                                                                                    modifying:
                                                                                        ''
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        type="primary"
                                                                        onClick={() =>
                                                                            this.setState(
                                                                                {
                                                                                    modifying:
                                                                                        ''
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        Modify
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    onClick={() =>
                                                                        this.setState(
                                                                            {
                                                                                modifying: component
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    Modify
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
                        width: 400px;
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
            </div>
        );
    }
}

export default connect(
    null,
    { editRun, refreshRun, showManageRunModal }
)(EditRun);
