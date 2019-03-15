import React, { Component } from 'react';
import { Tooltip } from 'antd';

class Status extends Component {
    render() {
        const { triplet } = this.props;
        if (triplet) {
            const { status, comment, cause } = triplet;
            return (
                <Tooltip placement="top" title={comment}>
                    <div
                        style={{
                            textAlign: 'center',
                            position: 'relative'
                        }}
                    >
                        {comment.length > 0 && (
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
                        <div>
                            {status === 'GOOD' && (
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
                            {status === 'EXCLUDED' && (
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
                            {status === 'BAD' && (
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
                            {status === 'STANDBY' && (
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
                            {status === 'NOTSET' && (
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
                        </div>
                    </div>
                </Tooltip>
            );
        } else {
            return <div />;
        }
    }
}

export default Status;
