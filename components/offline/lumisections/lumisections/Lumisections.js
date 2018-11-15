import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Icon, Divider } from 'antd';
import EditLumisections from './editLumisections/EditLumisections';
// import {components} from '../../../../config/config';
import { fetchLumisectionRanges } from '../../../../ducks/offline/lumisections';

const ls_attributes = [
    'beam1_present',
    'beam1_stable',
    'beam2_present',
    'beam2_stable',
    'bpix_ready',
    'castor_ready',
    'cms_infrastructure',
    'cms_active',
    'cscm_ready',
    'cscp_ready',
    'dt0_ready',
    'dtm_ready',
    'dtp_ready',
    'ebm_ready',
    'ebp_ready',
    'eem_ready',
    'eep_ready',
    'esm_ready',
    'esp_ready',
    'fpix_ready',
    'hbhea_ready',
    'hbheb_ready',
    'hbhec_ready',
    'hf_ready',
    'ho_ready',
    'rp_sect_45_ready',
    'rp_sect_56_ready',
    'rp_time_ready',
    'rpc_ready',
    'tecm_ready',
    'tecp_ready',
    'tibtid_ready',
    'tob_ready',
    'zdc_ready'
];

class Lumisections extends Component {
    componentDidMount() {
        this.props.fetchLumisectionRanges(this.props.dataset.id);
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
        ls_attributes.forEach(attribute => {
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
        console.log(workspace, dataset);
        return (
            <div>
                {dataset[`${workspace.toLowerCase()}_state`].value ===
                'OPEN' ? (
                    <EditLumisections
                        dataset={dataset}
                        ls_attributes={ls_attributes}
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
