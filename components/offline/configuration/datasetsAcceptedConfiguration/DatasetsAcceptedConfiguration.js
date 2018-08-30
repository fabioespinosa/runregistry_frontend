import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import {
    fetchDatasetsAccepted,
    addRegexp,
    editRegexp,
    removeRegexp
} from '../../../../ducks/offline/datasets_accepted';
import RegexpEditor from './regexpEditor/RegexpEditor';

class DatasetsAcceptedConfiguration extends Component {
    state = { add: false, edit: false };

    componentDidMount() {
        this.props.fetchDatasetsAccepted();
    }
    addRegexp = async values => {
        await this.props.addRegexp(values);
        this.setState({ add: false });
    };

    removeRegexp = async id_dataset_accepted => {
        console.log(id_dataset_accepted);
        const { value } = await Swal({
            type: 'warning',
            title: `Are you sure you want to delete this criteria?`,
            text: '',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            reverseButtons: true,
            footer: '<a >What does this mean?</a>'
        });
        if (value) {
            await this.props.removeRegexp(id_dataset_accepted);
            await Swal(`Criteria deleted`, '', 'success');
        }
    };

    editRegexp = async values => {
        await this.props.editRegexp(values);
        this.setState({ edit: false });
    };

    render() {
        const { datasets_accepted, addRegexp, editRegexp } = this.props;
        const { add, edit } = this.state;
        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Regular Expression',
                accessor: 'regexp',
                width: 680,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            { Header: 'Updated at', accessor: 'updatedAt', width: 100 },
            {
                Header: 'Edit',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() => {
                                console.log(row.original);
                                this.setState({ edit: row.original });
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
                        <a onClick={() => this.removeRegexp(row.original.id)}>
                            Delete
                        </a>
                    </div>
                )
            }
        ];
        const default_page_size = 17;
        return (
            <div>
                <p>Current Datasets Accepted Regular Expressions:</p>
                <ReactTable
                    columns={columns}
                    data={datasets_accepted}
                    defaultPageSize={default_page_size}
                    showPagination={
                        datasets_accepted.length > default_page_size
                    }
                    optionClassName="react-table"
                />
                <br />
                <div className="classsifier_button">
                    <Button
                        type="primary"
                        onClick={() =>
                            this.setState({ add: true, edit: false })
                        }
                    >
                        Add new Regular Expression
                    </Button>
                </div>
                {add && (
                    <RegexpEditor
                        cancel={() => this.setState({ add: false })}
                        submit={this.addRegexp}
                    />
                )}
                {edit && (
                    <RegexpEditor
                        cancel={() => this.setState({ edit: false })}
                        editing={edit}
                        submit={this.editRegexp}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        datasets_accepted: state.offline.datasets_accepted
    };
};

export default connect(
    mapStateToProps,
    {
        fetchDatasetsAccepted,
        addRegexp,
        editRegexp,
        removeRegexp
    }
)(DatasetsAcceptedConfiguration);
