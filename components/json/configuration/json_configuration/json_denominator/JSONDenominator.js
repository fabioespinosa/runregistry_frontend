import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import dynamic from 'next/dynamic';
import { api_url } from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const TextEditor = dynamic(
    import('../../../../common/ClassifierEditor/JSONEditor/JSONEditor'),
    {
        ssr: false
    }
);

class JSONDenominator extends Component {
    state = {
        denominator_logic: `
                    {
            "and": [
                {
                "or": [
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018A/DQM"]},
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018B/DQM"]},
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018C/DQM"]},
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018D/DQM"]},
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018E/DQM"]},
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018F/DQM"]},
                    {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018G/DQM"]}
                ]
                },
                {">=": [{"var": "run.run_number"}, 323414]},
                {"<=": [{"var": "run.run_number"}, 324293]}
            ]
            }
        `,
        rules_flagged_false_quantity: [],
        rules_flagged_false_combination: [],
        rules_flagged_false_quantity_luminosity: [],
        rules_flagged_false_combination_luminosity: []
    };

    generateVisualization = error_handler(async () => {
        const { golden_logic } = this.props;
        const { denominator_logic } = this.state;
        const { data } = await axios.post(`${api_url}/visualization/generate`, {
            golden_logic,
            denominator_logic
        });
        let {
            rules_flagged_false_quantity,
            rules_flagged_false_combination,
            rules_flagged_false_quantity_luminosity,
            rules_flagged_false_combination_luminosity
        } = data;

        rules_flagged_false_quantity = this.transform_data_to_recharts(
            rules_flagged_false_quantity
        );
        rules_flagged_false_combination = this.transform_data_to_recharts(
            rules_flagged_false_combination
        );
        rules_flagged_false_quantity_luminosity = this.transform_data_to_recharts(
            rules_flagged_false_quantity_luminosity
        );
        rules_flagged_false_combination_luminosity = this.transform_data_to_recharts(
            rules_flagged_false_combination_luminosity
        );
        this.setState({
            rules_flagged_false_quantity,
            rules_flagged_false_combination,
            rules_flagged_false_quantity_luminosity,
            rules_flagged_false_combination_luminosity
        });
    });

    transform_data_to_recharts = hash_values => {
        const data = [];
        for (const [name, value] of Object.entries(hash_values)) {
            data.push({
                name,
                value
            });
        }
        data.sort(function(a, b) {
            if (a.value < b.value) return 1;
            if (a.value > b.value) return -1;
            return 0;
        });
        return data;
    };
    render() {
        const {
            denominator_logic,
            rules_flagged_false_quantity,
            rules_flagged_false_combination,
            rules_flagged_false_quantity_luminosity,
            rules_flagged_false_combination_luminosity
        } = this.state;
        return (
            <div className="denominator_logic">
                JSON denominator
                <TextEditor
                    onChange={new_denominator =>
                        this.setState({ denominator_logic: new_denominator })
                    }
                    value={denominator_logic}
                    lan="javascript"
                    theme="github"
                />
                <br />
                <br />
                <Button onClick={this.generateVisualization} type="primary">
                    Generate visualization
                </Button>
                <br />
                Lumisections
                <BarChart
                    width={600}
                    height={300}
                    data={rules_flagged_false_quantity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                <BarChart
                    width={600}
                    height={300}
                    data={rules_flagged_false_combination}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                Luminosity:
                <BarChart
                    width={600}
                    height={300}
                    data={rules_flagged_false_quantity_luminosity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                <BarChart
                    width={600}
                    height={300}
                    data={rules_flagged_false_combination_luminosity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                <style jsx>{`
                    .denominator_logic {
                        width: 100%;
                    }
                `}</style>
            </div>
        );
    }
}

export default JSONDenominator;
