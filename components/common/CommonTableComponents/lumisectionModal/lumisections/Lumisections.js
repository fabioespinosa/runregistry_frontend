import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactTable from 'react-table';
import { Radio, Icon } from 'antd';

import {
    api_url,
    lumisection_attributes,
    certifiable_offline_components
} from '../../../../../config/config';
import LumisectionStatus from '../../LumisectionStatus';

import { error_handler } from '../../../../../utils/error_handlers';

class Lumisections extends Component {
    // shown_lumisections can be 'oms', 'run_registry', 'both'
    state = { shown_lumisections: 'oms_lumisection', lumisections: [] };
    componentDidMount() {
        this.fetchLumisections('oms_lumisection');
    }

    fetchLumisections = error_handler(async endpoint => {
        const { run_number, dataset_name } = this.props;
        const { data: lumisections } = await axios.post(
            `${api_url}/lumisections/${endpoint}_ranges`,
            { run_number, dataset_name }
        );
        this.setState({
            lumisections: lumisections.reverse(),
            shown_lumisections: endpoint
        });
    });

    handleLumisectionsDisplayedChange = async evt => {
        // If we are in online:
        const { value } = evt.target;
        this.fetchLumisections(value);
    };

    render() {
        const { run_number, dataset_name, workspace, workspaces } = this.props;
        const { shown_lumisections, lumisections } = this.state;
        let columns = [
            {
                Header: 'Run Number',
                accessor: 'run_number',
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <span>{run_number}</span>
                    </div>
                )
            },
            {
                Header: 'Section from',
                accessor: 'start',
                Cell: ({ value }) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <span>{value}</span>
                        </div>
                    );
                }
            },
            {
                Header: 'Section to',
                accessor: 'end',
                Cell: ({ value }) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <span>{value}</span>
                        </div>
                    );
                }
            }
        ];
        if (
            shown_lumisections === 'rr_lumisection' ||
            shown_lumisections === 'joint_lumisection'
        ) {
            if (dataset_name === 'online') {
                // let component_columns = components.map(component => ({
                //     Header: component
                // }));
                // component_columns = component_columns.map(column => {
                //     return {
                //         ...column,
                //         maxWidth: 66,
                //         id: `${column['Header']}`,
                //         accessor: data => {
                //             const triplet = data[`${column['Header']}`];
                //             return triplet;
                //         },
                //         Cell: ({ original, value }) => (
                //             <LumisectionStatus triplet={value} />
                //         )
                //     };
                // });

                columns = [...columns, ...component_columns];
            } else {
                // Add global columns
                const global_columns = [];
                for (const [key, val] of Object.entries(
                    certifiable_offline_components
                )) {
                    val.forEach(sub_name => {
                        global_columns.push(`${key}-${sub_name}`);
                    });
                }
                // all_columns_formatted are in the form of workspace-subcomponent like csc-efficiency
                let all_columns_formatted = [];
                workspaces.forEach(({ workspace, columns }) => {
                    columns.forEach(column => {
                        const column_name = `${workspace}-${column}`;
                        if (!global_columns.includes(column_name)) {
                            all_columns_formatted.push(column_name);
                        }
                    });
                });

                all_columns_formatted = all_columns_formatted.concat(
                    global_columns
                );
                // Put components in format Header: component
                let offline_columns_composed = [];
                if (workspace === 'global') {
                    offline_columns_composed = global_columns.map(column => ({
                        accessor: column,
                        Header: column.split('-')[1]
                    }));
                } else {
                    offline_columns_composed = all_columns_formatted
                        .filter(column => {
                            return (
                                column.startsWith(workspace.toLowerCase()) &&
                                column.includes('-')
                            );
                        })
                        .map(column => ({
                            accessor: column,
                            Header: column.split('-')[1]
                        }));
                }
                offline_columns_composed = offline_columns_composed.map(
                    column => {
                        return {
                            ...column,
                            maxWidth: 66,
                            id: column.accessor,
                            accessor: data => data[column.accessor],
                            Cell: ({ original, value }) => (
                                <LumisectionStatus triplet={value} />
                            )
                        };
                    }
                );
                columns = [...columns, ...offline_columns_composed];
            }
        }
        if (
            shown_lumisections === 'oms_lumisection' ||
            shown_lumisections === 'joint_lumisection'
        ) {
            lumisection_attributes.forEach(attribute => {
                columns.push({
                    Header: attribute,
                    accessor: attribute,
                    Cell: row => (
                        <div style={{ textAlign: 'center' }}>
                            <Icon
                                style={{
                                    fontSize: 15,
                                    margin: '0 auto',
                                    color: row.value ? 'green' : 'red'
                                }}
                                type={
                                    row.value ? 'check-circle' : 'close-circle'
                                }
                            />
                        </div>
                    )
                });
            });
        }
        return (
            <div>
                <center>
                    <Radio.Group
                        value={this.state.shown_lumisections}
                        onChange={this.handleLumisectionsDisplayedChange}
                    >
                        <Radio.Button value="oms_lumisection">
                            OMS LUMISECTIONS
                        </Radio.Button>
                        <Radio.Button value="rr_lumisection">
                            RR LUMISECTIONS
                        </Radio.Button>
                        <Radio.Button value="joint_lumisection">
                            BOTH
                        </Radio.Button>
                    </Radio.Group>
                </center>
                <br />
                <ReactTable
                    data={lumisections}
                    columns={columns}
                    defaultPageSize={20}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { workspace, workspaces } = state.offline.workspace;
    return {
        workspace,
        workspaces
    };
};

export default connect(mapStateToProps)(Lumisections);
