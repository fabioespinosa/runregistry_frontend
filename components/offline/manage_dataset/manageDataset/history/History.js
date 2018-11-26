import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Icon } from 'antd';
import {
    offline_columns,
    certifiable_offline_components
} from '../../../../../config/config';

class History extends Component {
    render() {
        const { dataset, workspace } = this.props;
        let dates = {};
        // MARK OF ONLINE TO OFFLINE MOMENT:
        // When the first global state was entered into a dataset, is when it first was created, therefore it marks the point in time:
        const moment_run_turn_into_dataset =
            dataset.global_state.history.length > 0
                ? dataset.global_state.history[0].when
                : dataset.global_state.when;
        // Introduce the 3 attributes that come from online:
        dataset.class = dataset.run.class;
        dataset.significant = dataset.run.significant;
        dataset.online_state = dataset.run.state;
        for (const [key, val] of Object.entries(dataset)) {
            if (val) {
                const history = val.history;
                if (Array.isArray(history)) {
                    // Add local value (not the history but the current value:)
                    val[key] = { ...val };
                    const { when } = val;
                    val.value_comes_from_online = false;
                    if (when < moment_run_turn_into_dataset) {
                        // If the date is prior to when the run turn into datset, it comes from ONLINE RUN:
                        val.value_comes_from_online = true;
                    }
                    if (dates[when]) {
                        dates[when] = dates[when].concat(val);
                    } else {
                        dates[when] = [val];
                    }
                    // Add historic values:
                    history.forEach(change => {
                        change[key] = { ...change };
                        const { when } = change;
                        change.value_comes_from_online = false;
                        if (when < moment_run_turn_into_dataset) {
                            // If the date is prior to when the run turn into datset, it comes from ONLINE RUN:
                            change.value_comes_from_online = true;
                        }
                        if (dates[when]) {
                            dates[when] = dates[when].concat(change);
                        } else {
                            dates[when] = [change];
                        }
                    });
                }
            }
        }
        let timeline = [];
        for (const [key, val] of Object.entries(dates)) {
            const event_in_timeline = {};
            event_in_timeline.when = key;
            val.forEach(change => {
                event_in_timeline = { ...event_in_timeline, ...change };
            });
            timeline.push(event_in_timeline);
        }
        // Sort timeline by date:
        timeline.sort((a, b) => a.when - b.when);
        console.log(timeline);
        let columns = [
            {
                Header: 'Time',
                accessor: 'when',
                minWidth: 200,
                Cell: ({ original, value }) => {
                    const date = new Date(value).toString();
                    const displayed_date = date.split('GMT')[0];
                    return (
                        <div style={{ textAlign: 'center' }}>
                            {displayed_date}
                        </div>
                    );
                }
            },
            {
                Header: 'User',
                accessor: 'by',
                minWidth: 200,
                Cell: ({ value }) => (
                    <div>
                        {value.startsWith('auto') ? (
                            <span>{value}</span>
                        ) : (
                            <span style={{ color: 'blue' }}>{value}</span>
                        )}
                    </div>
                )
            },
            {
                Header: 'Class',
                accessor: 'class',
                Cell: ({ original, value }) => (
                    <div style={{ textAlign: 'center' }}>
                        {value ? value.value : ''}
                    </div>
                )
            },
            {
                Header: 'Significant',
                accessor: 'significant',
                Cell: ({ original, value }) => {
                    if (value) {
                        return (
                            <div style={{ textAlign: 'center' }}>
                                {value.value ? (
                                    <Icon type={'check'} />
                                ) : (
                                    <Icon type={'cross'} />
                                )}
                            </div>
                        );
                    }
                    return <div />;
                }
            },
            {
                Header: 'Online State',
                accessor: 'online_state',
                Cell: ({ value }) => {
                    if (value) {
                        return (
                            <div style={{ textAlign: 'center' }}>
                                {value.value}
                            </div>
                        );
                    }
                    return <div />;
                }
            },
            {
                Header: `${workspace} State`,
                accessor: `${workspace.toLowerCase()}_state`,
                Cell: ({ original, value }) => {
                    if (value) {
                        return (
                            <div style={{ textAlign: 'center' }}>
                                {value.value}
                            </div>
                        );
                    }
                    return <div />;
                }
            },
            {
                Header: 'Appeared in',
                accessor: 'appeared_in',
                Cell: ({ original, value }) => {
                    if (value) {
                        return (
                            <div style={{ textAlign: 'center' }}>
                                {value.value}
                            </div>
                        );
                    }
                    return <div />;
                }
            }
        ];

        // Put components in format Header: component
        let offline_columns_composed = [];
        if (workspace === 'global') {
            offline_columns_composed = certifiable_offline_components.map(
                column => ({
                    accessor: column,
                    Header: column
                })
            );
        } else {
            offline_columns_composed = offline_columns
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
        offline_columns_composed = offline_columns_composed.map(column => {
            return {
                ...column,
                maxWidth: 66,
                id: column.accessor,
                accessor: data => {
                    let status = '';
                    const triplet = data[column.accessor];
                    if (triplet) {
                        status = triplet.status;
                    }
                    return status;
                },
                Cell: props => {
                    const { value } = props;
                    return (
                        <span
                            style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'center'
                            }}
                        >
                            {value === 'GOOD' && (
                                <div
                                    style={{
                                        backgroundColor: 'green',
                                        borderRadius: '1px'
                                    }}
                                >
                                    <span
                                        style={{
                                            color: 'white'
                                        }}
                                    >
                                        GOOD
                                    </span>
                                </div>
                            )}
                            {value === 'EXCLUDED' && (
                                <div
                                    style={{
                                        backgroundColor: 'grey',
                                        borderRadius: '1px'
                                    }}
                                >
                                    <span
                                        style={{
                                            color: 'white',
                                            fontSize: '0.85em'
                                        }}
                                    >
                                        EXCLUDED
                                    </span>
                                </div>
                            )}
                            {value === 'BAD' && (
                                <div
                                    style={{
                                        backgroundColor: 'red',
                                        borderRadius: '1px'
                                    }}
                                >
                                    <span
                                        style={{
                                            color: 'white'
                                        }}
                                    >
                                        BAD
                                    </span>
                                </div>
                            )}
                            {value === 'STANDBY' && (
                                <div
                                    style={{
                                        backgroundColor: 'yellow',
                                        borderRadius: '1px'
                                    }}
                                >
                                    <span
                                        style={{
                                            color: 'black'
                                        }}
                                    >
                                        STANDBY
                                    </span>
                                </div>
                            )}
                            {value === 'NOTSET' && (
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '1px'
                                    }}
                                >
                                    <span
                                        style={{
                                            color: 'black'
                                        }}
                                    >
                                        NOTSET
                                    </span>
                                </div>
                            )}
                        </span>
                    );
                }
            };
        });
        columns = [...columns, ...offline_columns_composed];
        return (
            <div>
                <h4>
                    History - Changes in the dataset as time progresses down.{' '}
                    <br />
                    Changes in Yellow mean they were done in ONLINE and they
                    belong to the run (they are shared across all datasets that
                    belong to the same run)
                </h4>
                <ReactTable
                    columns={columns}
                    data={timeline}
                    defaultPageSize={20}
                    className="-striped -highlight"
                    getTrProps={(state, rowInfo) => {
                        if (rowInfo) {
                            if (rowInfo.original.value_comes_from_online) {
                                return { style: { background: 'yellow' } };
                            }
                        }
                        return {};
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        workspace: state.offline.workspace.workspace
    };
};

export default connect(mapStateToProps)(History);
