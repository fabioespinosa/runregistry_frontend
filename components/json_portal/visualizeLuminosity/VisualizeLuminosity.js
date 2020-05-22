import React, { Component } from 'react';
import { animateScroll } from 'react-scroll';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { error_handler } from '../../../utils/error_handlers';

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
  '#d9d9d9',
];

const formatName = (name) => {
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

class VisualizeLuminosity extends Component {
  state = {
    rules_flagged_false_quantity_luminosity: [],
    rules_flagged_false_combination_luminosity: [],
  };

  componentDidMount() {
    animateScroll.scrollMore(600);
    this.generateVisualization();
  }

  componentDidUpdate(prevProps) {
    const { selected_json } = prevProps;
    const { selected_json: nextSelected } = this.props;
    if (selected_json && nextSelected) {
      if (selected_json.id !== nextSelected.id) {
        this.generateVisualization();
      }
    }
  }
  generateVisualization = error_handler(async () => {
    let {
      rules_flagged_false_quantity_luminosity,
      rules_flagged_false_combination_luminosity,
    } = this.props.selected_json;

    rules_flagged_false_quantity_luminosity = this.transform_data_to_recharts(
      rules_flagged_false_quantity_luminosity
    );
    rules_flagged_false_combination_luminosity = this.transform_data_to_recharts(
      rules_flagged_false_combination_luminosity
    );
    this.setState({
      rules_flagged_false_quantity_luminosity,
      rules_flagged_false_combination_luminosity,
    });
  });

  transform_data_to_recharts = (hash_values) => {
    const data = [];
    for (const [name, value] of Object.entries(hash_values)) {
      data.push({
        name,
        value,
      });
    }
    data.sort(function (a, b) {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });
    return data;
  };
  render() {
    const {
      total_recorded_luminosity_lost,
      total_delivered_luminosity_lost,
    } = this.props.selected_json;

    const {
      rules_flagged_false_quantity_luminosity,
      rules_flagged_false_combination_luminosity,
    } = this.state;
    console.log(
      'rules_flagged_false_quantity_luminosity',
      rules_flagged_false_quantity_luminosity
    );
    console.log(
      'rules_flagged_false_combination_luminosity',
      rules_flagged_false_combination_luminosity
    );
    return (
      <div className="contant">
        <br />
        Total recorded luminosity lost: {total_recorded_luminosity_lost}
        <br />
        Total delivered luminosity lost: {total_delivered_luminosity_lost}
        <br />
        <br />
        <br />
        <br />
        <br />
        <center>
          {/* Quantity luminosity */}
          <h2>Accumulation of Subsystem Responsibility</h2>
          <ResponsiveContainer width="80%" height={450}>
            <PieChart onMouseEnter={this.onPieEnter}>
              <Pie
                data={rules_flagged_false_quantity_luminosity}
                cx="50%"
                cy="50%"
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
                outerRadius={200}
                fill="#8884d8"
              >
                {rules_flagged_false_quantity_luminosity.map((entry, index) => (
                  <Cell fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <br />
          <br />
          <br />
          {/* Combination luminosity */}
          <h2>Combination of Subsystem Responsibility</h2>
          <ResponsiveContainer width="80%" height={450}>
            <PieChart margin={{ top: 30 }} onMouseEnter={this.onPieEnter}>
              <Pie
                data={rules_flagged_false_combination_luminosity}
                cx="50%"
                cy="50%"
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
                outerRadius={200}
                fill="#8884d8"
              >
                {rules_flagged_false_combination_luminosity.map(
                  (entry, index) => (
                    <Cell fill={COLORS[index % COLORS.length]} />
                  )
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <br />
          <br />
          <br />
          <h2>Accumulation of Subsystem Luminosity Loss</h2>
          <ResponsiveContainer width="80%" height={600}>
            <BarChart
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
          </ResponsiveContainer>
          <br />
          <br />
          <br />
          <h2>Combination of Subsystem Luminosity Loss</h2>
          <ResponsiveContainer width="80%" height={600}>
            <BarChart
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
          </ResponsiveContainer>
        </center>
        <style jsx>{`
          .contant {
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}

export default VisualizeLuminosity;
