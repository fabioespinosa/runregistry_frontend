import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Select, Input, Button, Spin } from 'antd';
import axios from 'axios';

import EditComponent from '../../../../common/editComponent/EditComponent';
import {
    api_url,
    certifiable_offline_components
} from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';

class EditRunLumisections extends Component {
    state = {
        lumisections: {},
        loading: true
    };
    componentDidMount() {
        this.fetchLumisections();
    }

    fetchLumisections = error_handler(async () => {
        this.setState({ lumisections: {}, loading: true });
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/rr_lumisection_ranges_by_component`,
            {
                dataset_name: this.props.dataset.name,
                run_number: this.props.dataset.run_number
            }
        );
        this.setState({ lumisections, loading: false });
    });
    render() {
        const { dataset, workspaces } = this.props;
        const current_workspace = this.props.workspace.toLowerCase();
        let components = [];
        if (current_workspace === 'global') {
            for (const [key, val] of Object.entries(
                certifiable_offline_components
            )) {
                val.forEach(sub_name => {
                    components.push(`${key}-${sub_name}`);
                });
            }
        } else {
            certifiable_offline_components[current_workspace].forEach(
                sub_name => {
                    components.push(`${current_workspace}-${sub_name}`);
                }
            );
            workspaces.forEach(({ workspace, columns }) => {
                if (workspace === current_workspace) {
                    columns.forEach(column => {
                        components.push(`${workspace}-${column}`);
                    });
                }
            });
        }
        return (
            <div>
                {dataset[`${current_workspace}_state`] !== 'waiting dqm gui' ? (
                    <div>
                        <br />
                        <table className="edit_run_form">
                            <thead>
                                <tr className="table_header">
                                    <td>Component</td>
                                    <td>Comment</td>
                                    <td>Modify</td>
                                </tr>
                            </thead>
                            <tbody>
                                {components.map(component => {
                                    const component_name = component.split(
                                        '-'
                                    )[1];

                                    if (this.state.loading) {
                                        return (
                                            <tr key={component}>
                                                <td>{component_name}</td>
                                                <td className="comment">
                                                    <Spin size="large" />
                                                </td>
                                                <td className="modify_toggle" />
                                            </tr>
                                        );
                                    } else if (
                                        Object.keys(this.state.lumisections)
                                            .length > 0
                                    ) {
                                        return (
                                            <EditComponent
                                                component_name={component_name}
                                                key={component}
                                                state={
                                                    dataset[
                                                        `${current_workspace}_state`
                                                    ]
                                                }
                                                run_number={dataset.run_number}
                                                dataset_name={dataset.name}
                                                refreshLumisections={
                                                    this.fetchLumisections
                                                }
                                                component={component}
                                                lumisection_ranges={
                                                    this.state.lumisections[
                                                        component
                                                    ]
                                                }
                                            />
                                        );
                                    } else {
                                        return (
                                            <tr key={component}>
                                                <td>{component_name}</td>
                                                <td className="comment">
                                                    No lumisection data
                                                </td>
                                                <td className="modify_toggle" />
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>
                        In order to edit a dataset's lumisections the dataset{' '}
                        <i style={{ textDecoration: 'underline' }}>
                            must appear in DQM GUI first
                        </i>
                        . <br /> <br />
                        You can overwrite this by clicking 'move' (directly in
                        the table)
                        <br />
                        <br />
                        This is an automatic process and every 5 minutes, DQM
                        GUI is checked to see if the dataset is already there.
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

const mapStateToProps = state => {
    return {
        workspace: state.offline.workspace.workspace,
        workspaces: state.offline.workspace.workspaces
    };
};

export default connect(
    mapStateToProps,
    {}
)(EditRunLumisections);
