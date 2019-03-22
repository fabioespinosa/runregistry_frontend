import axios from 'axios';
import React, { Component } from 'react';
import { api_url } from '../../../config/config';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
const formatLegend = (value, entry, summary) => {
    const count = summary[value] ? summary[value] : 0;
    const style = {};
    if (count > 0) {
        style.fontWeight = 900;
        style.textDecoration = 'underline';
    }
    return (
        <span style={style}>
            {value}({count})
        </span>
    );
};

class PopoverContent extends Component {
    state = { lumisections: [] };

    fetchLumisectionBar = async () => {
        const { run_number, dataset_name, component } = this.props;
        let { data: lumisections } = await axios.post(
            `${api_url}/datasets_get_lumisection_bar`,
            {
                run_number,
                name: dataset_name,
                component
            }
        );
        lumisections = lumisections.map((lumisection, index) => {
            if (lumisection) {
                return {
                    name: index + 1,
                    [lumisection.status]: 1
                };
            }
            return { name: index + 1, EMPTY: 1 };
        });
        this.setState({
            lumisections
        });
    };

    async componentDidMount() {
        await this.fetchLumisectionBar();
    }
    async componentDidUpdate(prevProps) {
        if (
            this.props.run_number !== prevProps.run_number ||
            this.props.dataset_name !== prevProps.dataset_name
        ) {
            // Set loading temporarily:
            this.setState({ lumisections: [] });
            await this.fetchLumisectionBar();
        }
    }
    render() {
        const {
            run_number,
            dataset_name,
            component,
            triplet_summary
        } = this.props;
        const summary = { ...triplet_summary };
        const { lumisections } = this.state;
        delete summary.comments;
        delete summary.causes;
        return (
            <div>
                <p>
                    Run <strong>{run_number}</strong>, from{' '}
                    <strong>{dataset_name}</strong>, component{' '}
                    <strong>
                        {component.split('_triplet')[0].toUpperCase()}
                    </strong>
                </p>
                <center>
                    {lumisections.length > 0 ? (
                        <strong>{lumisections.length} Lumisection(s):</strong>
                    ) : (
                        <strong>Loading...</strong>
                    )}
                </center>
                <BarChart
                    barCategoryGap={-1}
                    width={1000}
                    height={90}
                    data={lumisections}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval="preserveStartEnd" />
                    <Tooltip separator="" formatter={(value, name) => ''} />
                    <Legend
                        formatter={(value, entry) =>
                            formatLegend(value, entry, summary)
                        }
                    />
                    <Bar
                        isAnimationActive={false}
                        dataKey="BAD"
                        stackId="a"
                        fill="red"
                    />
                    <Bar
                        isAnimationActive={false}
                        dataKey="GOOD"
                        stackId="a"
                        fill="green"
                    />
                    <Bar
                        isAnimationActive={false}
                        dataKey="STANDBY"
                        stackId="a"
                        fill="yellow"
                    />
                    <Bar
                        isAnimationActive={false}
                        dataKey="EXCLUDED"
                        stackId="a"
                        fill="grey"
                    />
                    <Bar
                        isAnimationActive={false}
                        dataKey="NOTSET"
                        stackId="a"
                        fill="black"
                    />
                    <Bar
                        isAnimationActive={false}
                        dataKey="EMPTY"
                        stackId="a"
                        fill="silver"
                    />
                </BarChart>
            </div>
        );
    }
}

export default PopoverContent;
