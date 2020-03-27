import React, { Component } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

class LumisectionVisualization extends Component {
    createLumisectionArray = ({ good_lumisections, ls_duration }) => {
        const lumisections = [];
        // we start at 1 to make it 1-based:
        for (let i = 1; i <= ls_duration; i++) {
            const is_lumisection_is_included = this.isLumisectionIncludedInArray(
                good_lumisections,
                i
            );
            const lumisection = { name: i };
            if (is_lumisection_is_included) {
                lumisection['GOOD'] = 1;
            } else {
                lumisection['BAD'] = 1;
            }
            lumisections.push(lumisection);
        }
        return lumisections;
    };

    isLumisectionIncludedInArray = (good_lumisections, index) => {
        // Index of lumisection must not be 0-based but 1-based.
        let is_lumisection_included = false;
        good_lumisections.forEach(([start, end]) => {
            if (index >= start && index <= end) {
                is_lumisection_included = true;
            }
        });
        return is_lumisection_included;
    };

    inspectLumisection = ({ name: lumisection_number }) => {
        const { selected_dataset_to_visualize, json_logic } = this.props;
        const { run_number } = selected_dataset_to_visualize.run;
        const { name } = selected_dataset_to_visualize.dataset;
        this.props.test_lumisection({
            run_number,
            name,
            lumisection_number,
            json_logic
        });
    };

    render() {
        const { selected_dataset_to_visualize, current_json } = this.props;
        const { ls_duration } = selected_dataset_to_visualize.run.oms;
        const { run_number } = selected_dataset_to_visualize.run;

        const good_lumisections =
            current_json[selected_dataset_to_visualize.run.run_number] || [];

        const lumisections = this.createLumisectionArray({
            good_lumisections,
            ls_duration
        });

        return (
            <div>
                <h4>Lumisection Visualization</h4>
                The run {run_number} that this dataset belongs to contains{' '}
                {ls_duration} lumisections:
                <br />
                Lumisections deemed GOOD are:{' '}
                <strong>{JSON.stringify(good_lumisections)}</strong>
                <br />
                Click on any lumisection to see why it is deemed as included in
                the current json or excluded:
                <div>
                    <ResponsiveContainer width="100%" aspect={20.0 / 1.0}>
                        <BarChart
                            barCategoryGap={-1}
                            height={90}
                            data={lumisections}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 20,
                                bottom: 10
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" interval="preserveStartEnd" />
                            <Tooltip
                                separator=""
                                formatter={(value, name) => ''}
                            />
                            <Bar
                                isAnimationActive={false}
                                dataKey="BAD"
                                stackId="a"
                                fill="red"
                                onClick={this.inspectLumisection}
                            />
                            <Bar
                                isAnimationActive={false}
                                dataKey="GOOD"
                                stackId="a"
                                fill="green"
                                onClick={this.inspectLumisection}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
}

export default LumisectionVisualization;
