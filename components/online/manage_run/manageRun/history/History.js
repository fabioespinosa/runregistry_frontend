import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Icon } from 'antd';
import { components } from '../../../../../config/config';

class History extends Component {
    render() {
        const { run } = this.props;
        let dates = {};
        for (const [key, val] of Object.entries(run)) {
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
        console.log(dates);
        // debugger;
        let timeline = [];
        for (const [key, val] of Object.entries(dates)) {
            const event_in_timeline = {};
            event_in_timeline.when = key;
            val.forEach(change => {
                event_in_timeline = { ...event_in_timeline, ...change };
            });
            timeline.push(event_in_timeline);
        }

        timeline.sort((a, b) => a.when - b.when);
        console.log(timeline);
        let columns = [
            {
                Header: 'Time',
                accessor: 'when',
                Cell: ({ original, value }) => (
                    <div style={{ textAlign: 'center' }}>
                        {new Date(value).toString()}
                    </div>
                )
            },
            { Header: 'User', accessor: 'by' },
            { Header: 'Class', accessor: 'class' },
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
            }
        ];
        // {
        //     Header: 'State',
        //     accessor: 'state'
        // }
        let component_columns = components.map(component => ({
            Header: component
        }));
        component_columns = component_columns.map(column => {
            return {
                ...column,
                // maxWidth: 66,
                id: `${column['Header']}_triplet`,
                accessor: data => {
                    let status = '';
                    const triplet = data[`${column['Header']}_triplet`];
                    const { significant } = data;
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
        columns = [...columns, ...component_columns];
        return (
            <div>
                <h4>History, Changes in the run as time progresses down</h4>
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

export default History;
