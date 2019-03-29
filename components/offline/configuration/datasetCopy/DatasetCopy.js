import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import { datasetCopy } from '../../../../ducks/offline/dc_tools';

class DatasetCopy extends Component {
    constructor(props) {
        super(props);
        const state = {};
    }
    render() {
        const { datasets, syncComponents } = this.props;
        return (
            <div>
                <h3>
                    This tool will allow the DC Expert to copy datasets into
                    other
                </h3>
                <h5 style={{ textAlign: 'center', color: 'red' }}>
                    {datasets.length} Datasets Selected
                </h5>
                <br />
                <Formik
                    onSubmit={async values => {
                        // await datasetCopy(,);
                        await Swal(
                            `Component's synced for ${
                                datasets.length
                            } datasets`,
                            '',
                            'success'
                        );
                    }}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit}>
                                <Field />
                                <div className="buttons">
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        );
                    }}
                />
                <style jsx>{`
                    .dataset_copy_form {
                        margin: 0 auto;
                        border: 1px solid grey;
                    }
                    thead {
                        border-bottom: 3px solid grey;
                        text-align: center;
                    }
                    tr > td {
                        padding: 8px 5px;
                    }
                    tr:not(:last-child) {
                        border-bottom: 1px solid grey;
                    }

                    tr > td :not(:last-child) {
                        text-align: left;
                        border-right: 0.5px solid grey;
                    }

                    th {
                        text-align: center;
                    }

                    th > td:not(:last-child) {
                        border-right: 0.5px solid grey;
                        padding-right: 5px;
                    }
                    .comment {
                        width: 500px;
                    }

                    .buttons {
                        display: flex;
                        justify-content: flex-end;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        datasets: state.offline.datasets.datasets
    };
};

export default connect(
    mapStateToProps,
    {}
)(DatasetCopy);
