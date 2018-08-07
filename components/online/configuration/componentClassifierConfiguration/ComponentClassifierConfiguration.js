import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
import { Select, Icon } from 'antd';
import {
    fetchComponentClassifiers,
    deleteComponentClassifier,
    editComponentClassifier,
    newComponentClassifier
} from '../../../../ducks/online/classifiers/component';
import {
    editClassifierIntent,
    changeJsonEditorValue
} from '../../../../ducks/classifier_editor';
import stringify from 'json-stringify-pretty-compact';
const { Option } = Select;

const Editor = dynamic(
    import('../../../common/ClassifierEditor/ClassifierEditor'),
    {
        ssr: false
    }
);

class ComponentClassifierConfiguration extends Component {
    state = { component: 'castor', status_selected: 'GOOD' };
    componentDidMount() {
        this.props.fetchComponentClassifiers(this.state.component);
    }

    getDisplayedClassifier(classifier) {
        classifier = JSON.parse(classifier);
        const displayed_text = classifier.if[0];
        return stringify(displayed_text);
    }

    formatClassifierCorrectly = inside_input => {
        const { status_selected } = this.state;
        const parsed_input = JSON.parse(inside_input);
        let classifier = { if: [parsed_input, status_selected, 'BAD'] };
        return classifier;
    };

    changeComponent = component => {
        this.props.fetchComponentClassifiers(component);
        this.setState({ component });
    };

    render() {
        const {
            newComponentClassifier,
            editComponentClassifier,
            editClassifierIntent,
            changeJsonEditorValue,
            deleteComponentClassifier,
            classifiers
        } = this.props;
        const { component, status_selected } = this.state;
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
                Header: 'Status',
                accessor: 'status',
                width: 80,
                getProps: () => ({ style: { textAlign: 'center' } })
            },
            {
                Header: 'Component',
                accessor: 'component',
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
            {
                Header: 'JSON string',
                accessor: 'classifier',
                width: 250,
                Cell: row => {
                    const displayed_text = this.getDisplayedClassifier(
                        row.value
                    );
                    return <span>{displayed_text}</span>;
                }
            },
            { Header: 'Created at', accessor: 'createdAt', width: 100 },
            { Header: 'Updated at', accessor: 'updatedAt', width: 100 },
            {
                Header: 'Edit',
                width: 100,
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={() => {
                                const classifier = this.getDisplayedClassifier(
                                    row.original.classifier
                                );
                                editClassifierIntent(row.original);
                                changeJsonEditorValue(classifier);
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
                                deleteComponentClassifier(row.original.id)
                            }
                        >
                            Delete
                        </a>
                    </div>
                )
            }
        ];
        const components_options = [
            <Option key="castor" value="castor">
                castor
            </Option>,
            <Option key="cms" value="cms">
                cms
            </Option>,
            <Option key="csc" value="csc">
                csc
            </Option>,
            <Option key="cttps" value="cttps">
                cttps
            </Option>,
            <Option key="dt" value="dt">
                dt
            </Option>,
            <Option key="ecal" value="ecal">
                ecal
            </Option>,
            <Option key="es" value="es">
                es
            </Option>,
            <Option key="hcal" value="hcal">
                hcal
            </Option>,
            <Option key="hlt" value="hlt">
                hlt
            </Option>,
            <Option key="l1t" value="l1t">
                l1t
            </Option>,
            <Option key="l1tcalo" value="l1tcalo">
                l1tcalo
            </Option>,
            <Option key="l1tmu" value="l1tmu">
                l1t
            </Option>,
            <Option key="lumi" value="lumi">
                lumi
            </Option>,
            <Option key="pix" value="pix">
                pix
            </Option>,
            <Option key="rpc" value="rpc">
                rpc
            </Option>,
            <Option key="strip" value="strip">
                strip
            </Option>
        ];
        return (
            <div>
                <label htmlFor="status_select">Component:</label>&nbsp;
                <Select
                    name=""
                    id="component_select"
                    defaultValue={component}
                    onChange={this.changeComponent}
                >
                    {components_options}
                </Select>
                <ReactTable
                    columns={columns}
                    data={classifiers}
                    defaultPageSize={10}
                    showPagination={classifiers.length > 10}
                    optionClassName="react-table"
                />
                <Editor
                    formatClassifierCorrectly={this.formatClassifierCorrectly}
                    editClassifier={editComponentClassifier}
                    newClassifier={valid_js_object =>
                        newComponentClassifier(
                            valid_js_object,
                            status_selected,
                            component
                        )
                    }
                >
                    <div>
                        <label htmlFor="status_select">Class:</label>&nbsp;
                        <Select
                            name=""
                            id="status_select"
                            defaultValue={status_selected}
                            onChange={value =>
                                this.setState({ status_selected: value })
                            }
                        >
                            <Option value="GOOD">GOOD</Option>
                            <Option value="BAD">BAD</Option>
                            <Option value="STANDBY">STANDBY</Option>
                            <Option value="EXCLUDED">EXCLUDED</Option>
                        </Select>
                        <label htmlFor="component_select_create">
                            Component:
                        </label>&nbsp;
                        <Select
                            name=""
                            id="component_select_create"
                            defaultValue={component}
                            onChange={value =>
                                this.setState({ component: value })
                            }
                        >
                            {components_options}
                        </Select>
                    </div>
                </Editor>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        classifiers: state.online.classifiers.component
    };
};

export default connect(
    mapStateToProps,
    {
        fetchComponentClassifiers,
        deleteComponentClassifier,
        editComponentClassifier,
        newComponentClassifier,
        changeJsonEditorValue,
        editClassifierIntent
    }
)(ComponentClassifierConfiguration);
