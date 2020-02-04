import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import dynamic from 'next/dynamic';
import { api_url } from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = [
  '#3182bd',
  '#6baed6',
  '#9ecae1',
  '#c6dbef',
  '#e6550d',
  '#fd8d3c',
  '#fdae6b',
  '#fdd0a2',
  '#31a354',
  '#74c476',
  '#a1d99b',
  '#c7e9c0',
  '#756bb1',
  '#9e9ac8',
  '#bcbddc',
  '#dadaeb',
  '#636363',
  '#969696',
  '#bdbdbd',
  '#d9d9d9'
];

const TextEditor = dynamic(
  import('../../../../common/ClassifierEditor/JSONEditor/JSONEditor'),
  {
    ssr: false
  }
);

const formatName = name => {
  // debugger;
  let parsed_name = name;
  if (typeof name === 'string') {
    parsed_name = JSON.parse(name);
  }

  let final_name = '';
  if (Array.isArray(parsed_name)) {
    for (const rule of parsed_name) {
      final_name += ', ' + formatName(rule);
    }
  } else {
    const rule_array = parsed_name[Object.keys(parsed_name)[0]];
    if (Array.isArray(rule_array)) {
      const variable = rule_array[0];
      final_name = variable['var'];
    }
  }
  return final_name;
};

class JSONDenominator extends Component {
  state = {
    denominator_logic: `
                    {
            "and": [
                {
                "or": [
        {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018D/DQM"]}

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
    console.log('rules_flagged_false_quantity', rules_flagged_false_quantity);
    console.log(
      'rules_flagged_false_combination',
      rules_flagged_false_combination
    );
    console.log(
      'rules_flagged_false_quantity_luminosity',
      rules_flagged_false_quantity_luminosity
    );
    console.log(
      'rules_flagged_false_combination_luminosity',
      rules_flagged_false_combination_luminosity
    );
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
        {/* Quantity luminosity */}
        <PieChart width={1200} height={400} onMouseEnter={this.onPieEnter}>
          <Pie
            data={rules_flagged_false_quantity_luminosity}
            cx={600}
            cy={200}
            startAngle={90}
            endAngle={-270}
            labelLine
            label={({ name, value, percent }) => {
              if (percent > 0.05) {
                name = formatName(name);
                return `${name} - ${value.toFixed(2)} - ${(
                  percent * 100
                ).toFixed(0)}%`;
              }
              // return false;
            }}
            outerRadius={80}
            fill="#8884d8"
          >
            {rules_flagged_false_quantity_luminosity.map((entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        {/* Combination luminosity */}
        <PieChart width={1200} height={400} onMouseEnter={this.onPieEnter}>
          <Pie
            data={rules_flagged_false_combination_luminosity}
            cx={600}
            cy={200}
            startAngle={90}
            endAngle={-270}
            labelLine
            label={({ name, value, percent }) => {
              if (percent > 0.05) {
                name = formatName(name);
                return `${name} - ${value.toFixed(2)} - ${(
                  percent * 100
                ).toFixed(0)}%`;
              }
              // return false;
            }}
            outerRadius={80}
            fill="#8884d8"
          >
            {rules_flagged_false_combination_luminosity.map((entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
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
