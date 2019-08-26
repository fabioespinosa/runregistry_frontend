import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { Button } from 'antd';
import {
    generateJson,
    changeJsonLogic
} from '../../../../ducks/json/configuration';
import stringify from 'json-stringify-pretty-compact';

const TextEditor = dynamic(
    import('../../../common/ClassifierEditor/JSONEditor/JSONEditor'),
    {
        ssr: false
    }
);

class Configuration extends Component {
    changeValue = new_configuration => {
        this.props.changeJsonLogic(new_configuration);
    };

    getDisplayedJSON(json) {
        return stringify(json);
    }

    render() {
        const { generateJson, current_json, json_logic } = this.props;
        const download_string =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(this.getDisplayedJSON(current_json));

        return (
            <div className="configuration">
                <div className="editor">
                    <h3>Insert JSON-logic to generate the json:</h3>
                    <TextEditor
                        onChange={this.changeValue}
                        value={json_logic}
                        lan="javascript"
                        theme="github"
                    />
                    <div className="generate_button">
                        <Button
                            type="primary"
                            onClick={() => generateJson(json_logic)}
                        >
                            Generate JSON
                        </Button>
                    </div>
                </div>
                <div className="produced_json">
                    <h3>Generated JSON:</h3>
                    <TextEditor
                        onChange={() => {}}
                        value={this.getDisplayedJSON(current_json)}
                        lan="javascript"
                        theme="github"
                        readOnly={true}
                    />
                    <div className="generate_button">
                        <Button
                            type="primary"
                            disabled={current_json === '{}'}
                            onClick={() => generateJson(json_logic)}
                        >
                            <a
                                href={download_string}
                                download="custom_json.json"
                            >
                                Download JSON file
                            </a>
                        </Button>
                    </div>
                </div>
                <style jsx>{`
                    .configuration {
                        display: flex;
                    }
                    .editor {
                        width: 1000px;
                    }
                    .produced_json {
                        width: 1000px;
                    }
                    .generate_button {
                        margin-top: 10px;
                        display: flex;
                        justify-content: center;
                    }
                `}</style>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        current_json: state.json.configuration.current_json,
        json_logic: state.json.configuration.json_logic
    };
}

export default connect(
    mapStateToProps,
    { generateJson, changeJsonLogic }
)(Configuration);
