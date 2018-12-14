import React, { Component } from 'react';
import axios from 'axios';
import { Icon } from 'antd';
import { api_url } from '../../../../config/config';

class ClassifierVisualization extends Component {
    state = { class_classifiers: [], result: [], selected_class: '' };
    async componentDidMount() {
        const { data: class_classifiers } = await axios.get(
            `${api_url}/classifiers/class`
        );
        this.setState({
            class_classifiers
        });
    }

    testClassifier = async selected_class => {
        const { run } = this.props;
        const { data } = await axios.post(`${api_url}/classifier_playground`, {
            run,
            classifier: selected_class.classifier
        });
        this.setState({
            selected_class: selected_class.class,
            result: data.result[0],
            run_data: data.run_data
        });
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
                        {JSON.stringify(rules[0])} -{' '}
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
        const { class_classifiers, result, selected_class } = this.state;
        console.log(result);
        return (
            <div>
                Why is this run not a:
                <ul>
                    {class_classifiers.map(current_class => (
                        <li key={current_class.class}>
                            <a
                                onClick={() =>
                                    this.testClassifier(current_class)
                                }
                            >
                                {current_class.class}
                            </a>
                        </li>
                    ))}
                </ul>
                {result.length > 0 && (
                    <div>
                        {result[1].resulted_value
                            ? `This run is ${selected_class} `
                            : `This run is not ${selected_class} `}{' '}
                        because:
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

export default ClassifierVisualization;
