import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Icon, Button } from 'antd';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
import stringify from 'json-stringify-pretty-compact';

class ClassifierVisualization extends Component {
    state = { result: [] };
    componentDidMount = error_handler(async () => {
        const { selected_dataset_to_visualize, json_logic } = this.props;
        this.testClassifier(selected_dataset_to_visualize, json_logic);
    });

    testClassifier = error_handler(
        async (selected_dataset_to_visualize, json_logic) => {
            for (const [key, val] of Object.entries(json_logic)) {
            }
            const { data } = await axios.post(
                `${api_url}/classifier_playground_arbitrary`,
                {
                    data: selected_dataset_to_visualize,
                    json_logic
                }
            );
            this.setState({
                result: data.result[0]
            });
        }
    );

    transformJSONLumisectionVars = json_logic => {
        // for(const[key, val] of Object.entries(json_logic) ) {
        //     if( )
        // }
    };

    displayRules = (rules, parent) => {
        const final_value = rules[rules.length - 1];
        if (final_value.hasOwnProperty('resulted_value')) {
            if (
                rules[0].hasOwnProperty('and') ||
                rules[0].hasOwnProperty('or')
            ) {
                const children = rules[0][Object.keys(rules[0])];
                const diplayed_chilren = children.map(child_rule =>
                    this.displayRules(child_rule, final_value.resulted_value)
                );
                const color = final_value.resulted_value
                    ? 'rgba(76, 175, 80, 0.5);'
                    : 'rgba(244, 67, 54, 0.3);';
                const background =
                    parent === undefined
                        ? color
                        : parent !== final_value.resulted_value
                        ? color
                        : 'transparent';
                return (
                    <li
                        className={final_value.resulted_value ? 'green' : 'red'}
                    >
                        <Icon
                            style={{
                                fontSize: 15,
                                margin: '0 auto',
                                color: final_value.resulted_value
                                    ? 'green'
                                    : 'red'
                            }}
                            type={
                                final_value.resulted_value
                                    ? 'check-circle'
                                    : 'close-circle'
                            }
                        />
                        {' - '}
                        <strong>{Object.keys(rules[0])[0]}</strong>
                        <ul>{diplayed_chilren}</ul>
                        <style jsx>{`
                            ul {
                                margin-left: 5px;
                                margin-right: 0px;
                                padding-left: 30px;
                                padding-right: 0px;
                                list-style: none;
                                position: relative;
                            }
                            ul:before {
                                content: '';
                                height: 100%;
                                border-left: solid 2px
                                    ${final_value.resulted_value
                                        ? 'green'
                                        : 'red'};
                                position: absolute;
                                left: 0;
                            }
                            li {
                                margin: 0;
                                padding: 0;
                            }
                            .green {
                                background-color: ${background};
                            }
                            .red {
                                background-color: ${background};
                            }
                        `}</style>
                    </li>
                );
            } else {
                // We are in a leaf of a tree (no more children)
                const color = final_value.resulted_value
                    ? 'rgba(76, 175, 80, 0.5);'
                    : 'rgba(244, 67, 54, 0.3);';
                const background =
                    parent === undefined
                        ? color
                        : parent !== final_value.resulted_value
                        ? color
                        : 'transparent';
                return (
                    <li
                        className={final_value.resulted_value ? 'green' : 'red'}
                    >
                        <Icon
                            style={{
                                fontSize: 15,
                                margin: '0 auto',
                                color: final_value.resulted_value
                                    ? 'green'
                                    : 'red'
                            }}
                            type={
                                final_value.resulted_value
                                    ? 'check-circle'
                                    : 'close-circle'
                            }
                        />
                        {' - '}
                        {JSON.stringify(rules[0])}
                        <style jsx>{`
                            .green {
                                background-color: ${background};
                            }
                            .red {
                                background-color: ${background};
                            }
                        `}</style>
                    </li>
                );
            }
        }
    };

    render() {
        const { selected_dataset_to_visualize } = this.props;
        const { result } = this.state;
        return (
            <div>
                {result.length > 0 && (
                    <div>
                        Visualization:
                        <ul>{this.displayRules(result)}</ul>
                    </div>
                )}

                <style jsx>{`
                    ul {
                        margin-left: 5px;
                        margin-right: 0px;
                        padding-left: 10px;
                        padding-right: 0px;
                        list-style: none;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        json_logic: state.json.configuration.json_logic,
        selected_dataset_to_visualize:
            state.json.ui.selected_dataset_to_visualize
    };
};
export default connect(
    mapStateToProps,
    {}
)(ClassifierVisualization);
