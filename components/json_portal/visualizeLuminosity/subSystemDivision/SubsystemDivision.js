import React, { Component, useState } from 'react';
import { animateScroll } from 'react-scroll';
import { Radio } from 'antd';
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
import { LuminositySourceModal } from './luminositySourceModal/LuminositySourceModal';
import { error_handler } from '../../../../utils/error_handlers';
import { dcs_mapping } from '../../../../config/json_visualization_dcs_bit_mapping';
import { add_jsons_fast } from 'golden-json-helpers';

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

const getVars = (rule) => {
  let parsed_rule = rule;
  if (typeof rule === 'string') {
    parsed_rule = JSON.parse(rule);
  }

  let vars = [];
  if (Array.isArray(parsed_rule)) {
    for (const rule of parsed_rule) {
      vars = [...vars, ...getVars(rule)];
    }
  } else {
    const operator = Object.keys(parsed_rule)[0];
    const rule_array = parsed_rule[operator];
    if (operator === '==') {
      if (Array.isArray(rule_array)) {
        const variable = rule_array[0];
        if (typeof variable['var'] === 'undefined') {
          vars = [...vars, ...getVars(variable)];
        } else {
          vars.push(variable['var']);
        }
      }
    } else if (operator === 'in') {
      const variable = rule_array[1];
      vars.push(variable['var']);
    }
  }
  return vars;
};

const getWhichSubsystemDCSBelongsTo = (dcs_var) => {
  for (const [subsystem, dcs_vars] of Object.entries(dcs_mapping)) {
    if (dcs_vars.includes(dcs_var)) {
      return subsystem;
    }
  }
  return 'unknown';
};

const CustomTooltip = ({ label, active, payload, runs }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}: ${payload[0].value}`}</p>
        <p className="desc">{JSON.stringify(runs[label], null, 2)}</p>
      </div>
    );
  }
  return null;
};

const PieChartAndBarChart = ({ title, data, runs }) => {
  const [barChart, setChart] = useState('bar');
  const [showModal, setShowModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const onClick = (props) => {
    if (props) {
      setShowModal(true);
      setSelectedLabel(props.activeLabel);
    }
  };
  return (
    <div>
      {showModal && (
        <LuminositySourceModal
          label={selectedLabel}
          visible={showModal}
          hideModal={() => setShowModal(false)}
          runs={runs}
        />
      )}
      <h2>
        {title} {barChart === 'bar' ? 'Bar Chart' : 'Pie Chart'}{' '}
      </h2>
      <Radio.Group
        defaultValue="bar"
        buttonStyle="solid"
        onChange={(e) => setChart(e.target.value)}
      >
        <Radio.Button value="bar">Bar</Radio.Button>
        <Radio.Button value="pie">Pie</Radio.Button>
      </Radio.Group>
      {barChart === 'bar' ? (
        <ResponsiveContainer width="80%" height={600}>
          <BarChart
            layout="vertical"
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            onClick={onClick}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" interval={0} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="80%" height={450}>
          <PieChart onClick={onClick}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              labelLine
              label={({ name, value, percent }) => {
                if (percent > 0.05) {
                  // name = formatName(name);
                  return `${name} - ${value.toFixed(2)} - ${(
                    percent * 100
                  ).toFixed(0)}%`;
                }
                // return false;
              }}
              outerRadius={200}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

class VisualizeLuminosity extends Component {
  state = {
    rules_flagged_false_quantity_luminosity: [],
    rules_flagged_false_combination_luminosity: [],
    dcs_lumi_losses: [],
    subsystem_dcs_losses: [],
    rr_lumi_losses: [],
    subsystem_rr_losses: [],
    subsystem_rr_loss: [],
    inclusive_losses: [],
    exclusive_losses: [],
    dcs_lumi_losses_runs: {},
    subsystem_dcs_losses_runs: {},
    rr_lumi_losses_runs: {},
    subsystem_rr_losses_runs: {},
    inclusive_losses_runs: {},
    exclusive_losses_runs: {},
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
      runs_lumisections_responsible_for_rule,
    } = this.props.selected_json;

    // ONLY DCS:
    let dcs_lumi_losses = {};
    let dcs_lumi_losses_runs = {};
    let dcs_lumi_loss_total = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      dcs_only.forEach((dcs_name) => {
        dcs_lumi_loss_total += val;
        if (typeof dcs_lumi_losses[dcs_name] === 'undefined') {
          dcs_lumi_losses[dcs_name] = val;
          dcs_lumi_losses_runs[dcs_name] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          dcs_lumi_losses[dcs_name] = dcs_lumi_losses[dcs_name] + val;
          dcs_lumi_losses_runs[dcs_name] = add_jsons_fast(
            dcs_lumi_losses_runs[dcs_name],
            runs_lumisections_responsible_for_rule[key]
          );
        }
      });
    }
    console.log('only dcs', dcs_lumi_losses);
    console.log('only dcs runs', dcs_lumi_losses_runs);

    // DCS grouped per subsystem:
    let subsystem_dcs_losses = {};
    let subsystem_dcs_losses_runs = {};
    let subsystem_lumi_loss_total = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      const subsystem_already_added = {};
      dcs_only.forEach((dcs_name) => {
        // We need to find to which subsystem does this dcs rule belong to:
        const subsystem = getWhichSubsystemDCSBelongsTo(dcs_name);
        if (typeof subsystem_already_added[subsystem] === 'undefined') {
          subsystem_lumi_loss_total += val;
          if (typeof subsystem_dcs_losses[subsystem] === 'undefined') {
            subsystem_dcs_losses[subsystem] = val;
            subsystem_dcs_losses_runs[subsystem] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            subsystem_dcs_losses[subsystem] =
              subsystem_dcs_losses[subsystem] + val;
            subsystem_dcs_losses_runs[subsystem] = add_jsons_fast(
              subsystem_dcs_losses_runs[subsystem],
              runs_lumisections_responsible_for_rule[key]
            );
          }
          subsystem_already_added[subsystem] = true;
        }
      });
    }
    console.log('subsystem dcs', subsystem_dcs_losses);
    console.log('subsystem dcs runs', subsystem_dcs_losses_runs);

    // RR Quality:
    let rr_lumi_losses = {};
    let rr_lumi_losses_runs = {};
    let rr_lumi_loss_total = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      rr_only.forEach((rr_name) => {
        rr_lumi_loss_total += val;
        if (typeof rr_lumi_losses[rr_name] === 'undefined') {
          rr_lumi_losses[rr_name] = val;
          rr_lumi_losses_runs[rr_name] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          rr_lumi_losses[rr_name] = rr_lumi_losses[rr_name] + val;
          rr_lumi_losses_runs[rr_name] = add_jsons_fast(
            rr_lumi_losses_runs[rr_name],
            runs_lumisections_responsible_for_rule[key]
          );
        }
      });
    }
    console.log('rr losses', rr_lumi_losses);
    console.log('rr losses runs', rr_lumi_losses_runs);

    // RR Quality per subsystem:
    let subsystem_rr_losses = {};
    let subsystem_rr_losses_runs = {};
    let subsystem_rr_loss = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      const subsystem_already_added = {};
      rr_only.forEach((rr_name) => {
        const subsystem = rr_name.split('-')[0];
        if (typeof subsystem_already_added[subsystem] === 'undefined') {
          subsystem_rr_loss += val;
          if (typeof subsystem_rr_losses[subsystem] === 'undefined') {
            subsystem_rr_losses[subsystem] = val;
            subsystem_rr_losses_runs[subsystem] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            subsystem_rr_losses[subsystem] =
              subsystem_rr_losses[subsystem] + val;
            subsystem_rr_losses_runs[subsystem] = add_jsons_fast(
              subsystem_rr_losses_runs[subsystem],
              runs_lumisections_responsible_for_rule[key]
            );
          }
          subsystem_already_added[subsystem] = true;
        }
      });
    }

    console.log('subsystem rr', subsystem_rr_losses);
    console.log('subsystem rr runs', subsystem_rr_losses_runs);

    // Both:
    let inclusive_losses = {};
    let inclusive_losses_runs = {};
    let inclusive_loss = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      const subsystem_already_added = {};
      rr_only.forEach((rr_name) => {
        const subsystem = rr_name.split('-')[0];
        if (typeof subsystem_already_added[subsystem] === 'undefined') {
          inclusive_loss += val;
          if (typeof inclusive_losses[subsystem] === 'undefined') {
            inclusive_losses[subsystem] = val;
            inclusive_losses_runs[subsystem] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            inclusive_losses[subsystem] = inclusive_losses[subsystem] + val;
            inclusive_losses_runs[subsystem] = add_jsons_fast(
              inclusive_losses_runs[subsystem],
              runs_lumisections_responsible_for_rule[key]
            );
          }
          subsystem_already_added[subsystem] = true;
        }
      });

      dcs_only.forEach((dcs_name) => {
        // We need to find to which subsystem does this dcs rule belong to:
        const subsystem = getWhichSubsystemDCSBelongsTo(dcs_name);
        if (typeof subsystem_already_added[subsystem] === 'undefined') {
          inclusive_loss += val;
          if (typeof inclusive_losses[subsystem] === 'undefined') {
            inclusive_losses[subsystem] = val;
            inclusive_losses_runs[subsystem] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            inclusive_losses[subsystem] = inclusive_losses[subsystem] + val;
            inclusive_losses_runs[subsystem] = add_jsons_fast(
              inclusive_losses_runs[subsystem],
              runs_lumisections_responsible_for_rule[key]
            );
          }
          subsystem_already_added[subsystem] = true;
        }
      });
    }
    console.log('both quality and dcs inclusive losses', inclusive_losses);
    console.log(
      'both quality and dcs inclusive losses runs',
      inclusive_losses_runs
    );

    // Exclusive losses
    let exclusive_losses = {
      mixed: 0,
    };
    let exclusive_losses_runs = { mixed: {} };
    let exclusive_loss = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      const loss_added = false;
      for (const [subsystem, dcs_bits] of Object.entries(dcs_mapping)) {
        const only_dcs_bits_from_this_subystem = dcs_only.every((dcs_bit) =>
          dcs_bits.includes(dcs_bit)
        );
        const only_rr_from_this_subystem = rr_only.every(
          (rr_rule) => rr_rule.split('-')[0] === subsystem
        );
        if (only_dcs_bits_from_this_subystem && only_rr_from_this_subystem) {
          exclusive_loss += val;
          loss_added = true;
          if (typeof exclusive_losses[subsystem] === 'undefined') {
            exclusive_losses[subsystem] = val;
            exclusive_losses_runs[subsystem] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            exclusive_losses[subsystem] = exclusive_losses[subsystem] + val;
            exclusive_losses_runs[subsystem] = add_jsons_fast(
              exclusive_losses_runs[subsystem],
              runs_lumisections_responsible_for_rule[key]
            );
          }
        }
      }
      if (!loss_added) {
        exclusive_losses['mixed'] = exclusive_losses['mixed'] + val;
        exclusive_losses_runs['mixed'] = add_jsons_fast(
          exclusive_losses_runs['mixed'],
          runs_lumisections_responsible_for_rule[key]
        );
      }
    }
    console.log('both quality and dcs exclusive losses', exclusive_losses);
    console.log(
      'both quality and dcs exclusive losses runs',
      exclusive_losses_runs
    );

    dcs_lumi_losses = this.transform_data_to_recharts(dcs_lumi_losses);
    subsystem_dcs_losses = this.transform_data_to_recharts(
      subsystem_dcs_losses
    );
    rr_lumi_losses = this.transform_data_to_recharts(rr_lumi_losses);
    subsystem_rr_losses = this.transform_data_to_recharts(subsystem_rr_losses);
    inclusive_losses = this.transform_data_to_recharts(inclusive_losses);
    exclusive_losses = this.transform_data_to_recharts(exclusive_losses);

    rules_flagged_false_quantity_luminosity = this.transform_data_to_recharts(
      rules_flagged_false_quantity_luminosity
    );
    rules_flagged_false_combination_luminosity = this.transform_data_to_recharts(
      rules_flagged_false_combination_luminosity
    );
    this.setState({
      rules_flagged_false_quantity_luminosity,
      rules_flagged_false_combination_luminosity,

      dcs_lumi_losses,
      subsystem_dcs_losses,
      rr_lumi_losses,
      subsystem_rr_losses,
      inclusive_losses,
      exclusive_losses,

      dcs_lumi_losses_runs,
      subsystem_dcs_losses_runs,
      rr_lumi_losses_runs,
      subsystem_rr_losses_runs,
      inclusive_losses_runs,
      exclusive_losses_runs,

      dcs_lumi_loss_total,
      subsystem_lumi_loss_total,
      rr_lumi_loss_total,
      subsystem_rr_loss,
      inclusive_loss,
      exclusive_loss,
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

      dcs_lumi_losses,
      subsystem_dcs_losses,
      rr_lumi_losses,
      subsystem_rr_losses,
      inclusive_losses,
      exclusive_losses,

      dcs_lumi_losses_runs,
      subsystem_dcs_losses_runs,
      rr_lumi_losses_runs,
      subsystem_rr_losses_runs,
      inclusive_losses_runs,
      exclusive_losses_runs,
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
          <PieChartAndBarChart
            title="Exclusive losses per Subsystem (both DCS and Subsystem)"
            data={exclusive_losses}
            runs={exclusive_losses_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Inclusive losses (only DCS)"
            data={dcs_lumi_losses}
            runs={dcs_lumi_losses_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Inclusive losses (only DCS per Subsystem)"
            data={subsystem_dcs_losses}
            runs={subsystem_dcs_losses_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Inclusive losses (only Quality per Subsystem)"
            data={subsystem_rr_losses}
            runs={subsystem_rr_losses_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Inclusive losses (DCS and Quality per Subsystem)"
            data={inclusive_losses}
            runs={inclusive_losses_runs}
          />
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
