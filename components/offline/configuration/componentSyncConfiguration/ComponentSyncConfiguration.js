import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { connect } from 'react-redux';
import { Button } from 'antd';
import {
    offline_column_structure,
    certifiable_offline_components
} from '../../../../config/config';
import { syncWorkspaces } from '../../../../ducks/offline/dc_tools';
import datasets from '../../../../ducks/offline/datasets';

class ComponentSyncConfiguration extends Component {
    constructor(props) {
        super(props);
        const state = {};
        // We put the name of the workspace to the selects on the right
        certifiable_offline_components.forEach(
            certifiable_offline_component => {
                const candidate_option = Object.keys(
                    offline_column_structure
                ).find(workspace => {
                    return workspace.startsWith(certifiable_offline_component);
                });
                if (typeof candidate_option !== 'undefined') {
                    state[
                        `${certifiable_offline_component}_workspace`
                    ] = candidate_option;
                } else {
                    state[
                        `${certifiable_offline_component}_workspace`
                    ] = Object.keys(offline_column_structure)[0];
                }
            }
        );
        this.state = state;
    }
    render() {
        const { datasets, syncWorkspaces } = this.props;
        return (
            <div>
                <h3>
                    This tool will allow the DC Expert to sync the status of
                    each workspace of the runs selected to the global workspace.
                </h3>
                <h4>Sync column must be selected for dropdown to work</h4>
                <h5 style={{ textAlign: 'center', color: 'red' }}>
                    {datasets.length} Datasets Selected
                </h5>
                <br />
                <Formik
                    onSubmit={async values => {
                        const dataset_ids = [];
                        datasets.forEach(dataset => {
                            dataset_ids.push(dataset.id);
                        });
                        const sync_values = {};
                        for (const [key, val] of Object.entries(values)) {
                            if (key.includes('_value')) {
                                sync_values[key.split('_value')[0]] = val;
                            }
                        }
                        await syncWorkspaces(sync_values, dataset_ids);
                    }}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit}>
                                <table className="component_sync_form">
                                    <thead>
                                        <tr>
                                            <td>Sync?</td>
                                            <td>
                                                Certifiable Component to be
                                                updated
                                            </td>
                                            <td>From Workspace</td>
                                            <td>Bit</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {certifiable_offline_components.map(
                                            certifiable_component => {
                                                return (
                                                    <tr
                                                        key={
                                                            certifiable_component
                                                        }
                                                    >
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            <Field
                                                                name={`${certifiable_component}_enabled`}
                                                                component="input"
                                                                type="checkbox"
                                                                onChange={evt => {
                                                                    const {
                                                                        checked
                                                                    } = evt.target;
                                                                    const changing_value_to = `${certifiable_component}_value`;
                                                                    const new_value =
                                                                        offline_column_structure[
                                                                            this
                                                                                .state[
                                                                                `${certifiable_component}_workspace`
                                                                            ]
                                                                        ][0];
                                                                    const pre_value = this
                                                                        .state[
                                                                        `${certifiable_component}_workspace`
                                                                    ];
                                                                    const final_value = `${
                                                                        this
                                                                            .state[
                                                                            `${certifiable_component}_workspace`
                                                                        ]
                                                                    }-${
                                                                        offline_column_structure[
                                                                            this
                                                                                .state[
                                                                                `${certifiable_component}_workspace`
                                                                            ]
                                                                        ][0]
                                                                    }`;
                                                                    if (
                                                                        checked
                                                                    ) {
                                                                        setFieldValue(
                                                                            changing_value_to,
                                                                            final_value
                                                                        );
                                                                        setFieldValue(
                                                                            `${certifiable_component}_enabled`,
                                                                            true
                                                                        );
                                                                    } else {
                                                                        setFieldValue(
                                                                            changing_value_to,
                                                                            undefined
                                                                        );
                                                                        setFieldValue(
                                                                            `${certifiable_component}_enabled`,
                                                                            false
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            {
                                                                certifiable_component
                                                            }
                                                        </td>
                                                        <td>
                                                            <select
                                                                name=""
                                                                id=""
                                                                disabled={
                                                                    !values[
                                                                        `${certifiable_component}_enabled`
                                                                    ]
                                                                }
                                                                onChange={evt => {
                                                                    this.setState(
                                                                        {
                                                                            [`${certifiable_component}_workspace`]: evt
                                                                                .target
                                                                                .value
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                {Object.keys(
                                                                    offline_column_structure
                                                                ).map(
                                                                    column => (
                                                                        <option
                                                                            key={
                                                                                column
                                                                            }
                                                                            selected={
                                                                                column ===
                                                                                this
                                                                                    .state[
                                                                                    `${certifiable_component}_workspace`
                                                                                ]
                                                                            }
                                                                        >
                                                                            {
                                                                                column
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <Field
                                                                key={
                                                                    certifiable_component
                                                                }
                                                                name={`${certifiable_component}_value`}
                                                                component="select"
                                                                disabled={
                                                                    !values[
                                                                        `${certifiable_component}_enabled`
                                                                    ]
                                                                }
                                                            >
                                                                {offline_column_structure[
                                                                    this.state[
                                                                        `${certifiable_component}_workspace`
                                                                    ]
                                                                ].map(bit => {
                                                                    const parent_workspace = this
                                                                        .state[
                                                                        `${certifiable_component}_workspace`
                                                                    ];
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                bit
                                                                            }
                                                                            value={`${parent_workspace}-${bit}`}
                                                                        >
                                                                            {
                                                                                bit
                                                                            }
                                                                        </option>
                                                                    );
                                                                })}
                                                            </Field>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
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
                    .component_sync_form {
                        margin: 0 auto;
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
                        text-align: left;
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
        datasets: state.offline.datasets.datasets
    };
};

export default connect(
    mapStateToProps,
    { syncWorkspaces }
)(ComponentSyncConfiguration);
