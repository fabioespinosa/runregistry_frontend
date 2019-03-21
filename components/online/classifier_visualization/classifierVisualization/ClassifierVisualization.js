import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Button } from 'antd';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
import stringify from 'json-stringify-pretty-compact';

class ClassifierVisualization extends Component {
    state = {
        class_classifiers: [],
        class_result: [],
        significant_result: [],
        selected_class: '',
        run_info: null
    };
    componentDidMount = error_handler(async () => {
        const { data: class_classifiers } = await axios.get(
            `${api_url}/classifiers/class`
        );
        const { data: dataset_classifiers } = await axios.get(
            `${api_url}/classifiers/dataset`
        );
        const run_class = this.props.run.class;
        const dataset_classifier = dataset_classifiers.filter(
            dataset_classifier => dataset_classifier.class === run_class
        )[0];
        this.setState({
            class_classifiers,
            dataset_classifier
        });
        this.testSignificanceClassifier();
    });

    testClassifier = error_handler(async selected_class => {
        const { run } = this.props;
        const { data } = await axios.post(`${api_url}/classifier_playground`, {
            run,
            classifier: selected_class.classifier
        });
        this.setState({
            selected_class: selected_class.class,
            class_result: data.result[0],
            run_data: data.run_data
        });
    });

    testSignificanceClassifier = error_handler(async () => {
        const { run } = this.props;
        const classifier = this.state.dataset_classifier;
        const { data } = await axios.post(`${api_url}/classifier_playground`, {
            run,
            classifier: classifier.classifier
        });
        this.setState({
            significant_result: data.result[0],
            run_data: data.run_data
        });
    });
    getRunInformation = error_handler(async () => {
        const { run_number } = this.props.run;
        const { data } = await axios.get(
            `${api_url}/classifier_playground/run_info/${run_number}`
        );
        this.setState({ run_info: data });
    });
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
        console.log(this.state);
        const { run } = this.props;
        const {
            class_classifiers,
            class_result,
            significant_result,
            selected_class,
            run_info
        } = this.state;
        return (
            <div>
                <div>
                    <strong>Why is Run {run.run_number} not a:</strong>
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
                    {class_result.length > 0 && (
                        <div>
                            {class_result[1].resulted_value
                                ? `This run is ${selected_class} `
                                : `This run is not ${selected_class} `}{' '}
                            because:
                            <ul>{this.displayRules(class_result)}</ul>
                        </div>
                    )}
                </div>
                <div>
                    <strong>
                        Why is Run {run.run_number} significant/non-significant?
                    </strong>
                </div>
                {significant_result.length > 0 && (
                    <div>
                        {significant_result[1].resulted_value
                            ? `This run is significant`
                            : `This run is not significant`}{' '}
                        because:
                        <ul>{this.displayRules(significant_result)}</ul>
                    </div>
                )}
                <br />
                <div>
                    {run_info ? (
                        <div>
                            Run information (lumisection attributes reduced to
                            truthy to calculate significance and run class){' '}
                            <br />
                            <Button onClick={this.getRunInformation}>
                                Refresh
                            </Button>
                            <pre>{stringify(run_info.run)}</pre>
                        </div>
                    ) : (
                        <Button onClick={this.getRunInformation}>
                            Show information of run
                        </Button>
                    )}
                </div>
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
