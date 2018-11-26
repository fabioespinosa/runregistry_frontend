import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Icon } from 'antd';
import { lumisection_attributes } from '../../../../config/config';

// import {components} from '../../../../config/config';
import { fetchLumisectionRanges } from '../../../../ducks/online/lumisections';

class Lumisections extends Component {
    componentDidMount() {
        this.props.fetchLumisectionRanges(this.props.run.run_number);
    }

    render() {
        const { lumisections } = this.props;
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
                            type={row.value ? 'check-circle' : 'close-circle'}
                        />
                    </div>
                )
            });
        });

        return (
            <div>
                <ReactTable
                    data={lumisections}
                    columns={columns}
                    defaultPageSize={15}
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
    { fetchLumisectionRanges }
)(Lumisections);
