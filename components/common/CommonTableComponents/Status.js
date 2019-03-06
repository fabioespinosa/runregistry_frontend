import React, { Component } from 'react';
import { Tooltip, Popover } from 'antd';
import PopoverContent from './PopoverContent';

// This is the order in which the statuses are displayed in the cell:
const status_order = ['BAD', 'GOOD', 'STANDBY', 'EXCLUDED', 'NOTSET', 'EMPTY'];
const status_colors_and_text = {
    BAD: {
        backgroundColor: 'red',
        text: 'white',
        fontSize: '1em'
    },
    GOOD: {
        backgroundColor: 'green',
        text: 'white',
        fontSize: '1em'
    },
    STANDBY: {
        backgroundColor: 'yellow',
        text: 'black',
        fontSize: '1em'
    },
    EXCLUDED: {
        backgroundColor: 'grey',
        text: 'white',
        fontSize: '0.85em'
    },
    NOTSET: {
        backgroundColor: 'white',
        text: 'black',
        fontSize: '1em'
    },
    EMPTY: {
        backgroundColor: 'white',
        text: 'black',
        fontSize: '1em'
    },
    INSIG: {
        backgroundColor: 'white',
        text: 'black',
        fontSize: '1em'
    }
};

class Status extends Component {
    render() {
        const {
            triplet_summary,
            significant,
            run_number,
            dataset_name,
            component
        } = this.props;
        if (triplet_summary) {
            const { comments, causes } = triplet_summary;
            const statuses = { ...triplet_summary };
            const statuses_present = [];
            delete statuses.comments;
            delete statuses.causes;
            // Order the array according to status_order
            for (const [status, number_of_lumisections] of Object.entries(
                statuses
            )) {
                if (number_of_lumisections > 0) {
                    statuses_present.push(status);
                }
            }
            statuses_present.sort((a, b) => {
                if (status_order.indexOf(b) === -1) {
                    return -1;
                }
                return status_order.indexOf(a) - status_order.indexOf(b);
            });
            return (
                <Popover
                    placement="top"
                    content={
                        <PopoverContent
                            run_number={run_number}
                            dataset_name={dataset_name}
                            component={component}
                            triplet_summary={triplet_summary}
                        />
                    }
                    trigger="hover"
                    title={comments.join(' ----- ')}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            position: 'relative'
                        }}
                    >
                        {comments.length > 0 && (
                            <span>
                                <span
                                    style={{
                                        position: 'absolute',
                                        borderLeft: '16px solid darkred',
                                        borderBottom: '16px solid transparent',
                                        zIndex: '100',
                                        left: '0',
                                        top: '0'
                                    }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        borderLeft: '16px solid transparent',
                                        borderBottom: '16px solid darkred',
                                        zIndex: '100',
                                        right: '0',
                                        bottom: '0'
                                    }}
                                />
                            </span>
                        )}
                        {significant ? (
                            <div style={{ position: 'relative' }}>
                                {statuses_present.map((status, index) => {
                                    const length = statuses_present.length;
                                    if (status_colors_and_text[status]) {
                                        const {
                                            backgroundColor,
                                            text,
                                            fontSize
                                        } = status_colors_and_text[status];
                                        return (
                                            <div
                                                className={`${index > 0 &&
                                                    'status_container'}`}
                                                key={status}
                                                style={{
                                                    display: 'inline-block',
                                                    backgroundColor,
                                                    width: `${100 / length}%`
                                                }}
                                            >
                                                <span
                                                    className="status"
                                                    style={{
                                                        color: text,
                                                        fontSize
                                                    }}
                                                >
                                                    {length === 1
                                                        ? status
                                                        : status[0]}
                                                </span>
                                                <style jsx>{`
                                                    .status_container:before {
                                                        content: '';
                                                        position: absolute;
                                                        left: ${index *
                                                            (100 / length) -
                                                            5}%;
                                                        border-right: 3px solid
                                                            ${backgroundColor};
                                                        border-top: 16px solid
                                                            transparent;
                                                    }
                                                `}</style>
                                            </div>
                                        );
                                    }
                                    return (
                                        <span
                                            key={status}
                                            style={{ backgroundColor: 'white' }}
                                        >
                                            <span style={{ color: 'black' }}>
                                                {status}
                                            </span>
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                style={{
                                    backgroundColor:
                                        status_colors_and_text['INSIG']
                                            .backgroundColor
                                }}
                            >
                                <span
                                    style={{
                                        color:
                                            status_colors_and_text['INSIG'].text
                                    }}
                                >
                                    INSIG.
                                </span>
                            </div>
                        )}
                    </div>
                </Popover>
            );
        }
        return <div>No Lumisection data in this run</div>;
    }
}

export default Status;
