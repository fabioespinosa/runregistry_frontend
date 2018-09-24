import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Icon } from 'antd';
import { offline_columns } from '../../../../../config/config';

class History extends Component {
    render() {
        const { dataset, workspace } = this.props;
        let dates = {};
        for (const [key, val] of Object.entries(dataset)) {
            if (val) {
                const history = val.history;
                if (Array.isArray(history)) {
                    // Add local value
                    val[key] = { ...val };
                    const { when } = val;
                    if (dates[when]) {
                        dates[when] = dates[when].concat(val);
                    } else {
                        dates[when] = [val];
                    }
                    // Add historic values:
                    history.forEach(change => {
                        change[key] = { ...change };
                        const { when } = change;
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
        let columns = [
            {
                Header: 'Time',
                accessor: 'when',
                minWidth: 200,
                Cell: ({ original, value }) => {
                    const date = new Date(value).toString();
                    const displayed_date = date.split('GMT')[0];
                    return (
                        <div
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            {displayed_date}
                        </div>
                    );
                }
            },
            { Header: 'User', accessor: 'by', minWidth: 200 },
            {
                Header: 'Class',
                accessor: 'class',
                Cell: ({ value }) => (
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
                            <div
                                style={{
                                    textAlign: 'center'
                                }}
                            >
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
                Header: 'State',
                accessor: 'state',
                Cell: ({ original, value }) => {
                    console.log(value);
                    if (value) {
                        return (
                            <div
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                {value.value}
                            </div>
                        );
                    }
                    return <div />;
                }
            }
        ];

        // Put components in format Header: component
        let offline_columns_composed = offline_columns
            .filter(column => {
                if (workspace === 'global') {
                    return !column.includes('_');
                }
                return column.startsWith(workspace.toLowerCase());
            })
            .map(column => ({
                // Header: column.split('_').join(' ')
                Header: column
            }));
        offline_columns_composed = offline_columns_composed.map(column => {
            return {
                ...column,
                maxWidth: 66,
                id: `${column['Header']}_triplet`,
                accessor: data => {
                    let status = '';
                    const triplet = data[column['Header']];
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
                    History - Changes in the dataset as time progresses down
                </h4>
                <ReactTable
                    columns={columns}
                    data={timeline}
                    defaultPageSize={20}
                    className="-striped -highlight"
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
