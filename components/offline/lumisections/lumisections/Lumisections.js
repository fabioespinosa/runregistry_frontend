import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Icon, Divider } from 'antd';
import { lumisection_attributes } from '../../../../config/config';
import EditLumisections from './editLumisections/EditLumisections';
// import {components} from '../../../../config/config';
import { fetchLumisectionRanges } from '../../../../ducks/offline/lumisections';

class Lumisections extends Component {
    componentDidMount() {
        const { dataset, workspace } = this.props;
        this.props.fetchLumisectionRanges(dataset.id, workspace);
    }

    render() {
        const { lumisections, dataset, workspace } = this.props;
        let columns = [
            {
                Header: 'Run Number',
                accessor: 'run_number',
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <span>{this.props.dataset.run_number}</span>
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
                {dataset[`${workspace.toLowerCase()}_state`].value ===
                'OPEN' ? (
                    <EditLumisections
                        dataset={dataset}
                        lumisection_attributes={lumisection_attributes}
                    />
                ) : (
                    <Divider>
                        To edit the Lumisections of this dataset in this
                        workspace, it must be marked OPEN for this workspace{' '}
                        <strong style={{ textDecoration: 'underline' }}>
                            ({workspace})
                        </strong>
                    </Divider>
                )}
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
    return {
        lumisections: state.offline.lumisections,
        workspace: state.offline.workspace.workspace
    };
};

export default connect(
    mapStateToProps,
    { fetchLumisectionRanges }
)(Lumisections);
