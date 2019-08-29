import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Icon, Button } from 'antd';
import { api_url } from '../../../../config/config';
import { error_handler } from '../../../../utils/error_handlers';
import LumisectionVisualization from './lumisectionVisualization/LumisectionVisualization';
import stringify from 'json-stringify-pretty-compact';

class ClassifierVisualization extends Component {
    state = { result: [] };
    componentDidMount = error_handler(async () => {
        const { selected_dataset_to_visualize, json_logic } = this.props;
        this.testClassifier(selected_dataset_to_visualize, json_logic);
    });

    testClassifier = error_handler(
        async (selected_dataset_to_visualize, json_logic) => {
            const parsed_logic = JSON.parse(json_logic);
            const ready_to_compare_logic = this.transformJSONLumisectionVars(
                parsed_logic
            );
            const stringified_ready_to_compare_logic = JSON.stringify(
                ready_to_compare_logic
            );
            const { data } = await axios.post(
                `${api_url}/classifier_playground_arbitrary`,
                {
                    data: selected_dataset_to_visualize,
                    json_logic: stringified_ready_to_compare_logic
                }
            );
            this.setState({
                result: data.result[0]
            });
        }
    );

    // In the database the cache is stored as "triplet_summary"."dt-dt".GOOD: 51
    // In JSON logic they are stored as {"==": [{"var": "lumisection.rr.dt-dt"}, "GOOD"]}
    // So we want a logic that works like this: {">": [{"var": "lumisection.rr.dt-dt.GOOD"}, 0]}
    // This converst the latter to the first.
    transformJSONLumisectionVars = json_logic => {
        for (const [key, val] of Object.entries(json_logic)) {
            // The only possible comparison with lumisections is the comparators, the rest are ands, ins or  ors:
            if (['==', '>=', '<=', '>', '<'].includes(key)) {
                return this.parse_operator(val, key);
            } else if (key === 'in') {
                return {
                    [key]: val
                };
            } else {
                return {
                    [key]: this.parse_and_or(val)
                };
            }
        }
    };
    parse_and_or = (array_of_expressions, operator) => {
        return array_of_expressions.map(expression => {
            return this.transformJSONLumisectionVars(expression);
        });
    };
    parse_operator = (operation, operator) => {
        const [lhs, rhs] = operation;
        if (typeof lhs['var'] !== 'undefined') {
            const variable = lhs['var'];
            const [level1, level2, level3] = variable.split('.');

            if (operator === '==' && level1 === 'lumisection') {
                if (level2 === 'rr') {
                    const new_path = `${level1}.${level2}.${level3}.${rhs}`;
                    return { '>': [{ var: new_path }, 0] };
                }
                if (level2 === 'oms') {
                    const upper_case_rhs = String(rhs).toUpperCase();
                    const new_path = `${level1}.${level2}.${level3}.${upper_case_rhs}`;
                    return { '>': [{ var: new_path }, 0] };
                }
            } else {
                return { [operator]: operation };
            }
        } else {
            if (typeof rhs !== 'object') {
                // Case where argumetns are (expr, value);
                return {
                    [operator]: [this.transformJSONLumisectionVars(lhs), rhs]
                };
            }
            if (typeof rhs === 'object') {
                // Comparing expression, to expression is only valid for equality comparison (==):
                return {
                    [operator]: [
                        this.transformJSONLumisectionVars(lhs),
                        this.transformJSONLumisectionVars(rhs)
                    ]
                };
            }
        }
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
        const {
            selected_dataset_to_visualize,
            included_in_json,
            current_json
        } = this.props;
        const { result } = this.state;
        const { name } = selected_dataset_to_visualize.dataset;
        const { run_number } = selected_dataset_to_visualize.run;
        return (
            <div>
                {result.length > 0 && (
                    <div>
                        Dataset <strong>{name}</strong> of run{' '}
                        <strong>{run_number}</strong>{' '}
                        <strong>
                            {included_in_json ? (
                                <span style={{ color: 'green' }}>
                                    IS Included in json
                                </span>
                            ) : (
                                <span style={{ color: 'red' }}>
                                    is NOT included in json
                                </span>
                            )}
                        </strong>
                        <ul>{this.displayRules(result)}</ul>
                        <LumisectionVisualization
                            selected_dataset_to_visualize={
                                selected_dataset_to_visualize
                            }
                            included_in_json={included_in_json}
                            current_json={current_json}
                        />
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
            state.json.ui.selected_dataset_to_visualize,
        included_in_json: state.json.ui.dataset_included_in_json,
        current_json: state.json.configuration.current_json
    };
};
export default connect(
    mapStateToProps,
    {}
)(ClassifierVisualization);
