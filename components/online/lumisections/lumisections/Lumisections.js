import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Select, Radio, Icon } from 'antd';

import { components, lumisection_attributes } from '../../../../config/config';
import LumisectionStatus from '../../../common/CommonTableComponents/LumisectionStatus';

// import {components} from '../../../../config/config';
import {
    fetchOMSLumisectionRanges,
    fetchRRLumisectionRanges,
    fetchJointLumisectionRanges
} from '../../../../ducks/online/lumisections';

class Lumisections extends Component {
    // shown_lumisections can be 'oms', 'run_registry', 'both'
    state = { shown_lumisections: 'oms' };
    componentDidMount() {
        const { run_number } = this.props.run;
        this.props.fetchOMSLumisectionRanges(run_number);
    }

    handleLumisectionsDisplayedChange = async evt => {
        // debugger;
        const { value } = evt.target;
        const { run_number } = this.props.run;
        if (value === 'oms') {
            await this.props.fetchOMSLumisectionRanges(run_number);
        } else if (value === 'run_registry') {
            await this.props.fetchRRLumisectionRanges(run_number, 'online');
        } else if (value === 'both') {
            await this.props.fetchJointLumisectionRanges(run_number, 'online');
        }
        this.setState({ shown_lumisections: value });
    };

    render() {
        const { lumisections } = this.props;
        const { shown_lumisections } = this.state;
        let columns = [
            {
                Header: 'Run Number',
                accessor: 'run_number',
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <span>{this.props.run.run_number}</span>
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
            shown_lumisections === 'run_registry' ||
            shown_lumisections === 'both'
        ) {
            let component_columns = components.map(component => ({
                Header: component
            }));
            component_columns = component_columns.map(column => {
                return {
                    ...column,
                    maxWidth: 66,
                    id: `${column['Header']}_triplet`,
                    accessor: data => {
                        const triplet = data[`${column['Header']}_triplet`];
                        return triplet;
                    },
                    Cell: ({ original, value }) => (
                        <LumisectionStatus triplet={value} />
                    )
                };
            });
            columns = [...columns, ...component_columns];
        }
        if (shown_lumisections === 'oms' || shown_lumisections === 'both') {
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
                        <Radio.Button value="oms">
                            OMS LUMISECTIONS
                        </Radio.Button>
                        <Radio.Button value="run_registry">
                            RR LUMISECTIONS
                        </Radio.Button>
                        <Radio.Button value="both">BOTH</Radio.Button>
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
    return { lumisections: state.online.lumisections };
};

export default connect(
    mapStateToProps,
    {
        fetchOMSLumisectionRanges,
        fetchRRLumisectionRanges,
        fetchJointLumisectionRanges
    }
)(Lumisections);
