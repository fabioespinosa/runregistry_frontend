import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import Swal from 'sweetalert2';
import { Button } from 'antd';
import {
    lumisection_attributes,
    offline_column_structure
} from '../../../../config/config';
import { syncLumisections } from '../../../../ducks/offline/dc_tools';

class LumisectionExceptionSync extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { datasets, syncLumisections } = this.props;
        return (
            <div>
                <h3>
                    This tool will allow the DC Expert to sync the lumisections
                    from each workspace to the global workspace.
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

                        const attributes_to_sync = {};
                        for (const [key, val] of Object.entries(values)) {
                            // If the lumisection attribute is selected (in the checkbox)
                            if (key.includes('_enabled') && val) {
                                const name_of_lumisection_attribute = key.split(
                                    '_enabled'
                                )[0];
                                // We put the selection from the select, or the first item:
                                attributes_to_sync[
                                    name_of_lumisection_attribute
                                ] =
                                    values[
                                        `${name_of_lumisection_attribute}_workspace`
                                    ] ||
                                    Object.keys(offline_column_structure)[0];
                            }
                        }
                        console.log(attributes_to_sync, dataset_ids);
                        await syncLumisections(attributes_to_sync, dataset_ids);
                        await Swal(
                            `Lumisections synced for ${
                                datasets.length
                            } datasets`,
                            '',
                            'success'
                        );
                    }}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit}>
                                <table className="lumisection_sync_form">
                                    <thead>
                                        <tr>
                                            <td>Sync?</td>
                                            <td>Attribute</td>
                                            <td>From Workspace</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lumisection_attributes.map(
                                            lumisection_attribute => {
                                                return (
                                                    <tr
                                                        key={
                                                            lumisection_attribute
                                                        }
                                                    >
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            <Field
                                                                name={`${lumisection_attribute}_enabled`}
                                                                component="input"
                                                                type="checkbox"
                                                                onChange={evt => {
                                                                    const {
                                                                        checked
                                                                    } = evt.target;
                                                                    if (
                                                                        checked
                                                                    ) {
                                                                        setFieldValue(
                                                                            `${lumisection_attribute}_enabled`,
                                                                            true
                                                                        );
                                                                    } else {
                                                                        setFieldValue(
                                                                            `${lumisection_attribute}_enabled`,
                                                                            false
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            {lumisection_attribute
                                                                .split('_')
                                                                .join(' ')}
                                                        </td>
                                                        <td>
                                                            <Field
                                                                key={`${lumisection_attribute}_workspace`}
                                                                name={`${lumisection_attribute}_workspace`}
                                                                component="select"
                                                                disabled={
                                                                    !values[
                                                                        `${lumisection_attribute}_enabled`
                                                                    ]
                                                                }
                                                                disabled={
                                                                    !values[
                                                                        `${lumisection_attribute}_enabled`
                                                                    ]
                                                                }
                                                            >
                                                                {Object.keys(
                                                                    offline_column_structure
                                                                ).map(
                                                                    workspace => (
                                                                        <option
                                                                            key={
                                                                                workspace
                                                                            }
                                                                            value={
                                                                                workspace
                                                                            }
                                                                        >
                                                                            {
                                                                                workspace
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
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
                    .lumisection_sync_form {
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
    { syncLumisections }
)(LumisectionExceptionSync);
