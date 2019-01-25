import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import {
    offline_column_structure,
    certifiable_offline_components
} from '../../../../config/config';
import { syncComponents } from '../../../../ducks/offline/dc_tools';

class ComponentSyncConfiguration extends Component {
    constructor(props) {
        super(props);
        const state = {};
        // We put the name of the workspace to the selects on the right
        // The next forEach puts the default bit of each workspace as selected
        certifiable_offline_components.forEach(
            certifiable_offline_component => {
                const candidate_option = Object.keys(
                    offline_column_structure
                ).find(workspace => {
                    return workspace.startsWith(certifiable_offline_component);
                });
                if (typeof candidate_option !== 'undefined') {
                    // If we find an option that starts with the workspace name, we set it as default:
                    state[
                        `${certifiable_offline_component}_default_workspace`
                    ] = candidate_option;
                } else {
                    // If we don't, we put the first one we find:
                    state[
                        `${certifiable_offline_component}_default_workspace`
                    ] = Object.keys(offline_column_structure)[0];
                }
            }
        );
        this.state = state;
    }
    render() {
        const { datasets, syncComponents } = this.props;
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
                        const components_to_sync = {};
                        // Remove the _value from the name:
                        for (const [key, val] of Object.entries(values)) {
                            if (key.includes('_value')) {
                                components_to_sync[
                                    key.split('_value')[0]
                                ] = val;
                            }
                        }
                        await syncComponents(components_to_sync, dataset_ids);
                        await Swal(
                            `Component's synced for ${
                                datasets.length
                            } datasets`,
                            '',
                            'success'
                        );
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
                                                // In the following variable we store the default workspace (third column "From workspace") respective to the certifiable component
                                                const default_workspace_for_certifiable_component = this
                                                    .state[
                                                    `${certifiable_component}_default_workspace`
                                                ];
                                                const sub_workspace_options =
                                                    offline_column_structure[
                                                        default_workspace_for_certifiable_component
                                                    ];
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
                                                                    const final_value = `${default_workspace_for_certifiable_component}-${
                                                                        sub_workspace_options[0]
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
                                                                defaultValue={
                                                                    default_workspace_for_certifiable_component
                                                                }
                                                                onChange={evt => {
                                                                    const {
                                                                        value
                                                                    } = evt.target;
                                                                    this.setState(
                                                                        {
                                                                            [default_workspace_for_certifiable_component]: value
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
                                                                    default_workspace_for_certifiable_component
                                                                ].map(bit => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                bit
                                                                            }
                                                                            value={`${default_workspace_for_certifiable_component}-${bit}`}
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
    { syncComponents }
)(ComponentSyncConfiguration);
