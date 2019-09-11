import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import { Button, Select, Input, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
const { Option } = Select;

import { datasetUpdate } from '../../../../ducks/offline/dc_tools';

class DatasetUpdate extends Component {
    state = { unique_dataset_names: [] };
    componentDidMount = error_handler(async () => {
        const { filter } = this.props;
        const { data: unique_dataset_names } = await axios.post(
            `${api_url}/dc_tools/unique_dataset_names`,
            {
                filter
            }
        );
        this.setState({ unique_dataset_names });
    });
    render() {
        const { datasets, count, filter } = this.props;
        const { unique_dataset_names } = this.state;
        const initialValues = {};
        return (
            <div>
                <h3>
                    This tool will allow the DC Expert to change dataset state
                    for several datasets
                </h3>
                <h5 style={{ textAlign: 'center', color: 'red' }}>
                    {count} Datasets Selected
                </h5>
                <h5>
                    {Object.keys(filter).length === 0
                        ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
                        : `With filter: ${JSON.stringify(filter)}`}
                </h5>
                <br />
                <Formik
                    initialValues={initialValues}
                    onSubmit={async values => {
                        await this.props.datasetUpdate(values);
                        await Swal(`Datasets state changed`, '', 'success');
                    }}
                    render={({ values, setFieldValue, handleSubmit }) => {
                        console.log(values);
                        return (
                            <form
                                onSubmit={handleSubmit}
                                className="dataset_update_form"
                            >
                                <div className="form_container">
                                    Source dataset name:
                                    <Select
                                        placeholder="Source dataset name"
                                        value={values['source_dataset_name']}
                                        onChange={value =>
                                            setFieldValue(
                                                'source_dataset_name',
                                                value
                                            )
                                        }
                                    >
                                        {unique_dataset_names.map(
                                            dataset_name => (
                                                <Option value={dataset_name}>
                                                    {dataset_name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                    <br />
                                    <br />
                                    Change state to:
                                    <Select
                                        placeholder="Change state to"
                                        value={values['new_state']}
                                        onChange={value =>
                                            setFieldValue('new_state', value)
                                        }
                                    >
                                        <Option value="COMPLETE">
                                            COMPLETE
                                        </Option>
                                        <Option value="OPEN">OPEN</Option>
                                        <Option value="SIGNOFF">SIGNOFF</Option>
                                    </Select>
                                    <br />
                                    <div className="buttons">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                />
                <style jsx>{`
                    .form_container {
                        margin: 0 auto;
                        width: 400px;
                    }

                    ul {
                        list-style: none;
                        margin-left: 20px;
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
    const { datasets, count, filter } = state.offline.editable_datasets;
    return {
        datasets,
        count,
        filter
    };
};

export default connect(
    mapStateToProps,
    { datasetUpdate }
)(DatasetUpdate);
