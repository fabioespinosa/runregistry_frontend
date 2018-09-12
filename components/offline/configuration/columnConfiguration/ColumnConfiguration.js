import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Swal from 'sweetalert2';
import { addColumn, removeColumn } from '../../../../ducks/offline/workspace';
import ColumnEditor from './columnEditor/ColumnEditor';

class ColumnConfiguration extends Component {
    state = { edit: false };

    addColumn = async (pog, column) => {
        const { value } = await Swal({
            type: 'question',
            title: `Are you sure you want to add the column ${column} to the ${pog} workspace?`,
            text: '',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            reverseButtons: true,
            footer: '<a >What does this mean?</a>'
        });
        if (value) {
            this.props.addColumn(pog, column);
            await Swal(
                `Column ${column} added to worskpace ${pog}.`,
                '',
                'success'
            );
        }
    };

    removeColumn = async (pog, column) => {
        const { value } = await Swal({
            type: 'warning',
            title: `Are you sure you want to delete the column ${column} from ${pog} workspace?`,
            text: '',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            reverseButtons: true,
            footer: '<a >What does this mean?</a>'
        });
        if (value) {
            await this.props.removeColumn(pog, column);
            await Swal(
                `Column ${column} deleted from worskpace ${pog}.`,
                '',
                'success'
            );
        }
    };

    render() {
        const { workspaces } = this.props;
        const columns = [
            {
                Header: 'Pog',
                accessor: 'pog',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Columns',
                accessor: 'columns',
                width: 680,
                getProps: () => ({ style: { textAlign: 'center' } }),
                Cell: row => {
                    const displayed_text = row.value.join(', ');
                    return (
                        <span>
                            <i>{displayed_text}</i>
                        </span>
                    );
                }
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
            }
        ];
        const default_page_size = 17;
        return (
            <div>
                <p>Current Class Classifier criteria:</p>
                <ReactTable
                    columns={columns}
                    data={workspaces}
                    defaultPageSize={default_page_size}
                    showPagination={workspaces.length > default_page_size}
                    optionClassName="react-table"
                />
                <br />
                {this.state.edit && (
                    <ColumnEditor
                        pog={this.state.edit.pog}
                        columns={this.state.edit.columns}
                        addColumn={this.addColumn}
                        removeColumn={this.removeColumn}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        workspaces: state.offline.workspace.workspaces
    };
};

export default connect(
    mapStateToProps,
    {
        addColumn,
        removeColumn
    }
)(ColumnConfiguration);
