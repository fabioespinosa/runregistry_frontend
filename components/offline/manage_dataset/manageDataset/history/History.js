import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Icon } from 'antd';
import {
    offline_columns,
    certifiable_offline_components
} from '../../../../../config/config';
import Status from '../../../../common/CommonTableComponents/Status';
import CommonValueComponent from '../../../../common/CommonTableComponents/CommonValueComponent';

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
        dataset.stop_reason = dataset.run.stop_reason;
        for (const [key, val] of Object.entries(dataset)) {
            if (val) {
                const history = val.history;
                if (Array.isArray(history)) {
                    if (
                        workspace !== 'global' &&
                        key.includes('-') &&
                        !key.startsWith(workspace.toLowerCase())
                    ) {
                        // If its a normal workspace we don't want history from other workspaces colluding
                        continue;
                    }
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
                Cell: ({ value }) => <CommonValueComponent value={value} />
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
                Cell: ({ value }) => <CommonValueComponent value={value} />
            },
            {
                Header: `${workspace} State`,
                accessor: `${workspace.toLowerCase()}_state`,
                Cell: ({ value }) => <CommonValueComponent value={value} />
            },
            {
                Header: 'Stop Reason',
                accessor: 'stop_reason',
                Cell: ({ value }) => <CommonValueComponent value={value} />
            },
            {
                Header: 'Appeared in',
                accessor: 'appeared_in',
                Cell: ({ value }) => <CommonValueComponent value={value} />
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
                    const triplet = data[column.accessor];
                    if (typeof triplet === 'object') {
                        return triplet;
                    }
                    return { status: '', comment: '', cause: '' };
                },
                Cell: ({ value }) => (
                    <Status triplet={value} significant={true} />
                )
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
