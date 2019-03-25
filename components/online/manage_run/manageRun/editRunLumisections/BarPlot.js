import React, { Component } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const color_coding = {
    BAD: 'red',
    GOOD: 'green',
    STANDBY: 'yellow',
    EXCLUDED: 'grey',
    NOTSET: 'black',
    EMPTY: 'silver'
};

const CustomTooltip = props => {
    const { active } = props;

    if (active) {
        const { payload, label } = props;
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                <p className="desc">Anything you want can be displayed here.</p>
            </div>
        );
    }

    return null;
};

class BarPlot extends Component {
    render() {
        const { ls_ranges_lengths, lumisection_ranges } = this.props;
        return (
            <BarChart
                barCategoryGap={-1}
                layout="vertical"
                width={400}
                height={80}
                data={ls_ranges_lengths}
                margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    domain={['dataMin', 'dataMax']}
                    type="number"
                    interval="preserveStartEnd"
                />
                <YAxis type="category" dataKey="title" />
                <Tooltip
                    formatter={(value, name, props) => {
                        // Get the respective status of this range:
                        let selected_status;
                        lumisection_ranges.forEach(range => {
                            const { start, end, status } = range;
                            const formatted_range = `${start} - ${end}`;
                            if (name === formatted_range) {
                                selected_status = status;
                            }
                        });
                        return selected_status;
                    }}
                />
                {lumisection_ranges.map(({ start, end, status }) => {
                    const key = `${start} - ${end}`;
                    return (
                        <Bar
                            key={key}
                            dataKey={key}
                            stackId="a"
                            fill={color_coding[status]}
                        />
                    );
                })}
            </BarChart>
        );
    }
}

export default BarPlot;
