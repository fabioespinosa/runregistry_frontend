import React, { Component } from 'react';
import { Button, Input } from 'antd';
import dynamic from 'next/dynamic';
import ReactTable from 'react-table';
const TextEditor = dynamic(import('./JSONEditor/Editor'), {
    ssr: false
});
const { TextArea } = Input;

class ClassTriggerConfiguration extends Component {
    state = {
        editor: false,
        loading: false
    };
    onEditorChange = (value, otherValue) => {
        console.log(value, otherValue);
    };
    render() {
        const data = [
            { priority: 1, name: 'collission', json_value: long_string },
            { priority: 2, name: 'commissioning', json_value: long_string },
            { priority: 3, name: 'cosmics', json_value: long_string }
        ];
        const columns = [
            {
                Header: 'Priority',
                accessor: 'priority',
                width: 100
            },
            {
                Header: 'Name',
                accessor: 'name',
                width: 100
            },
            {
                Header: 'JSON string',
                accessor: 'json_value',
                width: 500
            },
            {
                Header: 'Edit',
                width: 100,
                Cell: row => (
                    <div>
                        <a onClick={() => this.setState({ editor: true })}>
                            Edit
                        </a>
                    </div>
                )
            }
        ];
        return (
            <div>
                <p>Current criteria:</p>
                {/* <TextArea rows={7} /> */}
                <div>
                    <ReactTable
                        columns={columns}
                        data={data}
                        defaultPageSize={4}
                        showPagination={false}
                        optionClassName="react-table"
                    />
                </div>
                <div className="trigger_button">
                    {!this.state.editor && (
                        <Button
                            type="primary"
                            onClick={() => this.setState({ editor: true })}
                        >
                            Add Trigger
                        </Button>
                    )}
                </div>
                {this.state.editor && (
                    <TextEditor
                        onChange={this.onEditorChange}
                        lan="javascript"
                        theme="github"
                    />
                )}
                <div className="trigger_button">
                    {this.state.editor && (
                        <Button
                            loading={this.state.loading}
                            type="primary"
                            onClick={() => {
                                this.setState({ loading: true });
                                setTimeout(() => {
                                    this.setState({ loading: false });
                                    this.setState({
                                        editor: false
                                    });
                                }, 800);
                            }}
                        >
                            Save
                        </Button>
                    )}
                </div>

                <style jsx>{`
                    .trigger_button {
                        margin-top: 20px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: flex-end;
                    }

                    div :global(.react-table) {
                        color: red !important;
                    }
                `}</style>
            </div>
        );
    }
}

export default ClassTriggerConfiguration;

const long_string = `{
   "ECAL": {
      "good": [
         {
            "type": "and",
            "condition": [
               {
                  "type": ">",
                  "identifier": "events",
                  "value": 100
               },
               {
                  "type": "<",
                  "identifier": "runLiveLumi",
                  "value": 80
               }
            ]
         },
         {
            "type": "or",
            "condition": [
               {
                  "type": "=",
                  "identifier": "beam1Stable",
                  "value": "false"
               }
            ]
         }
      ],
      "bad": []
   }
}`;
