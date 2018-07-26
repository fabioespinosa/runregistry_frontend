import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Icon } from 'antd';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import {
    fetchClassClassifiers,
    deleteClassClassifier
} from '../../../../ducks/online/classifiers/class/classifiers';
import {
    editClassClassifierIntent,
    changeJsonEditorValue
} from '../../../../ducks/online/classifiers/class/ui';
const Editor = dynamic(
    import('./classClassifierEditor/ClassClassifierEditor'),
    {
        ssr: false
    }
);

class ClassClassifierConfiguration extends Component {
    componentDidMount() {
        this.props.fetchClassClassifiers();
    }

    render() {
        const columns = [
            {
                Header: 'id',
                width: 50,
                accessor: 'id',
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Priority',
                accessor: 'priority',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Class',
                accessor: 'class',
                width: 90,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Enabled',
                accessor: 'enabled',
                width: 80,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <Icon
                            style={{
                                margin: '0 auto',
                                color: row.value ? 'green' : 'red'
                            }}
                            type={row.value ? 'check-circle' : 'close-circle'}
                        />
                    </div>
                )
            },
            { Header: 'JSON string', accessor: 'classifier', width: 250 },
            { Header: 'Created at', accessor: 'createdAt', width: 100 },
            { Header: 'Updated at', accessor: 'updatedAt', width: 100 },
            {
                Header: 'Edit',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() => {
                                console.log(row.original);
                                this.props.editClassClassifierIntent(
                                    row.original
                                );
                                this.props.changeJsonEditorValue(
                                    row.original.classifier
                                );
                            }}
                        >
                            Edit
                        </a>
                    </div>
                )
            },
            {
                Header: 'Delete',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() =>
                                this.props.deleteClassClassifier(
                                    row.original.id
                                )
                            }
                        >
                            Delete
                        </a>
                    </div>
                )
            }
        ];
        return (
            <div>
                <p>Current criteria:</p>
                <ReactTable
                    columns={columns}
                    data={this.props.classifiers}
                    defaultPageSize={10}
                    showPagination={this.props.classifiers.length > 10}
                    optionClassName="react-table"
                />
                <Editor />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        classifiers: state.online.classifiers.class.classifiers
    };
};

export default connect(
    mapStateToProps,
    {
        fetchClassClassifiers,
        deleteClassClassifier,
        editClassClassifierIntent,
        changeJsonEditorValue
    }
)(ClassClassifierConfiguration);
