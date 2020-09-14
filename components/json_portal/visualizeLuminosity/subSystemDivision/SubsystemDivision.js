import React, { Component, useState, useRef, useCallback } from 'react';
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
import { CaretUpOutlined } from '@ant-design/icons';
import { LuminositySourceModal } from './luminositySourceModal/LuminositySourceModal';
import { error_handler } from '../../../../utils/error_handlers';
import {
  dcs_mapping,
  short_runs_mapping,
  tracker_mapping,
} from '../../../../config/json_visualization_dcs_bit_mapping';
import { add_jsons_fast } from 'golden-json-helpers';
import FileSaver from 'file-saver';
import { getPngData } from '../../../../utils/get_png_data';

const COLORS = [
  '#e6194b',
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
  '#ffffff',
  '#000000',
  '#ffe119',
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

const getWhichSubsystemDCSBelongsTo = (dcs_var, dcs_mapping) => {
  for (const [subsystem, dcs_vars] of Object.entries(dcs_mapping)) {
    if (dcs_vars.includes(dcs_var)) {
      return subsystem;
    }
  }
  return 'unknown';
};

function isSubsetOf(set, subset) {
  if (set.length === 0 || subset.length === 0) {
    return false;
  }
  for (let i = 0; i < set.length; i++) {
    if (subset.indexOf(set[i]) == -1) {
      return false;
    }
  }
  return true;
}

const RADIAN = Math.PI / 180;
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  value,
  percent,
  index,
  total_items,
  number_of_items_above_5_percent,
}) => {
  let radius = innerRadius + (outerRadius - innerRadius) * 1.1;
  if (percent < 0.05) {
    // console.log(total_items, )
    const index_of_item_above_5_percent =
      number_of_items_above_5_percent - (total_items - index);
    const overflow =
      index_of_item_above_5_percent / number_of_items_above_5_percent / 1.1;
    console.log(radius, 1 + overflow);
    radius = radius * (1 + overflow);
  }
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // const item = chartData[index];

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      key={`label-${name}-${value}`}
    >
      {name} - {value.toFixed(2)} ({(percent * 100).toFixed(0)}%)
    </text>
  );
};

function PieChartAndBarChart({ title, data, runs }) {
  const [barChart, setChart] = useState('bar');
  const [showModal, setShowModal] = useState(false);
  const [chart, setChartRef] = useState();
  const [selectedLabel, setSelectedLabel] = useState('');
  const onClick = (props) => {
    console.log(props);
    if (props) {
      if (props.activePayload && props.activePayload[0]) {
        setShowModal(true);
        setSelectedLabel(props.activePayload[0].payload.name);
      }
    }
  };

  const handleDownload = useCallback(async () => {
    // Send the chart to getPngData
    const pngData = await getPngData(chart, '#000000');
    // Can also pass an optional fill parameter for the background color
    // const pngData = await getPngData(chart, '#000000');
    // Use FileSaver to download the PNG
    FileSaver.saveAs(pngData, 'chart.png');
  }, [chart]);
  const total = data?.reduce((sum, { value }) => (sum += value), 0);
  const number_of_items_above_5_percent = data?.filter(
    ({ value }) => value / total <= 0.05
  ).length;
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
      </Radio.Group>{' '}
      &nbsp;
      <a onClick={handleDownload}>Download as PNG</a>
      {barChart === 'bar' ? (
        <ResponsiveContainer width="80%" height={600}>
          <BarChart
            ref={(ref) => setChartRef(ref)}
            layout="vertical"
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            onClick={onClick}
            cursor="pointer"
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
        <ResponsiveContainer width="80%" height={900}>
          <PieChart
            onClick={onClick}
            cursor="pointer"
            ref={(ref) => setChartRef(ref)}
          >
            <Pie
              data={data}
              isAnimationActive={false}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              labelLine
              label={(args) => {
                args = {
                  ...args,
                  number_of_items_above_5_percent,
                  total_items: data.length,
                };
                return renderLabel(args);
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
}

const Delta = ({ value, reason }) => {
  return (
    <p>
      <CaretUpOutlined /> = {value}/pb {reason}
    </p>
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

    const rules_flagged_false_combination_without_short_runs = {};
    // Only short runs:
    let short_runs_losses = {};
    let short_runs_runs = {};
    let short_runs_total = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      // Short run attributes always belong to OMS:
      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      let category_added = false;
      dcs_only.forEach((dcs_name) => {
        const category = getWhichSubsystemDCSBelongsTo(
          dcs_name,
          short_runs_mapping
        );
        if (category !== 'unknown') {
          category_added = true;
          short_runs_total += val;
          if (typeof short_runs_losses[dcs_name] === 'undefined') {
            short_runs_losses[dcs_name] = val;
            short_runs_runs[dcs_name] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            short_runs_losses[dcs_name] += val;
            short_runs_runs[dcs_name] = add_jsons_fast(
              short_runs_runs[dcs_name],
              runs_lumisections_responsible_for_rule[key]
            );
          }
        }
      });
      // Now we build a combination without the short runs keys:
      if (!category_added) {
        rules_flagged_false_combination_without_short_runs[key] = val;
      }
    }

    // Exlusive only short runs;
    let short_runs_exclusive_losses = {};
    let short_runs_exclusive_runs = {};
    let short_runs_exclusive_total = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_luminosity
    )) {
      const vars = getVars(key);
      // Short run attributes always belong to OMS:
      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      const all_belong_to_short_runs =
        dcs_only.length > 0 &&
        dcs_only.every(
          (rule) =>
            getWhichSubsystemDCSBelongsTo(rule, short_runs_mapping) !==
            'unknown'
        );
      if (all_belong_to_short_runs) {
        const category_string = dcs_only.join(', ');
        short_runs_exclusive_total += val;
        if (
          typeof short_runs_exclusive_losses[category_string] === 'undefined'
        ) {
          short_runs_exclusive_losses[category_string] = val;
          short_runs_exclusive_runs[category_string] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          short_runs_exclusive_losses[category_string] += val;
          short_runs_exclusive_runs[category_string] = add_jsons_fast(
            short_runs_exclusive_runs[category_string],
            runs_lumisections_responsible_for_rule[key]
          );
        }
      }
    }
    // ONLY DCS:
    let dcs_lumi_losses = {};
    let dcs_lumi_losses_runs = {};
    let dcs_lumi_loss_total = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
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
          dcs_lumi_losses[dcs_name] += val;
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
      rules_flagged_false_combination_without_short_runs
    )) {
      const vars = getVars(key);
      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      const subsystem_already_added = {};
      dcs_only.forEach((dcs_name) => {
        // We need to find to which subsystem does this dcs rule belong to:
        const subsystem = getWhichSubsystemDCSBelongsTo(dcs_name, dcs_mapping);
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
      rules_flagged_false_combination_without_short_runs
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

    // RR Quality per subsystem (inclusive):
    let subsystem_rr_losses = {};
    let subsystem_rr_losses_runs = {};
    let subsystem_rr_loss = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      let loss_added = false;

      // We remove tracker_hv:
      if (!loss_added) {
        const strip_dcs_bits = tracker_mapping['strip'];
        const pixel_dcs_bits = tracker_mapping['pixel'];
        // For tracker_hv to be added it must be at least one from strip and at least 1 from pixel:
        const number_of_dcs_bits_in_strip = dcs_only.filter((dcs_bit) =>
          strip_dcs_bits.includes(dcs_bit)
        ).length;
        const number_of_dcs_bits_in_pixel = dcs_only.filter((dcs_bit) =>
          pixel_dcs_bits.includes(dcs_bit)
        ).length;
        if (
          number_of_dcs_bits_in_strip > 0 &&
          number_of_dcs_bits_in_pixel > 0
        ) {
          loss_added = true;
        }
      }

      if (!loss_added && dcs_only.length === 0) {
        const subsystem_already_added = {};
        rr_only.forEach((rr_name) => {
          let [rr_subsystem, rr_column] = rr_name.split('-');

          if (rr_subsystem === 'ecal' && rr_column === 'es') {
            rr_subsystem = 'es';
          }
          if (rr_subsystem === 'tracker' && rr_column === 'strip') {
            rr_subsystem = 'strip';
          }
          if (rr_subsystem === 'tracker' && rr_column === 'pixel') {
            rr_subsystem = 'pixel';
          }
          if (rr_subsystem === 'tracker' && rr_column === 'track') {
            rr_subsystem = 'track';
          }
          if (typeof subsystem_already_added[rr_subsystem] === 'undefined') {
            subsystem_rr_loss += val;
            if (typeof subsystem_rr_losses[rr_subsystem] === 'undefined') {
              subsystem_rr_losses[rr_subsystem] = val;
              subsystem_rr_losses_runs[rr_subsystem] =
                runs_lumisections_responsible_for_rule[key];
            } else {
              subsystem_rr_losses[rr_subsystem] =
                subsystem_rr_losses[rr_subsystem] + val;
              subsystem_rr_losses_runs[rr_subsystem] = add_jsons_fast(
                subsystem_rr_losses_runs[rr_subsystem],
                runs_lumisections_responsible_for_rule[key]
              );
            }
            subsystem_already_added[rr_subsystem] = true;
          }
        });
      }
    }

    console.log('subsystem rr', subsystem_rr_losses);
    console.log('subsystem rr runs', subsystem_rr_losses_runs);

    // Both:
    let inclusive_losses = {};
    let inclusive_losses_runs = {};
    let inclusive_loss = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
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
        let [rr_subsystem, rr_column] = rr_name.split('-');
        if (rr_subsystem === 'ecal' && rr_column === 'es') {
          rr_subsystem = 'es';
        }
        if (rr_subsystem === 'tracker' && rr_column === 'strip') {
          rr_subsystem = 'strip';
        }
        if (rr_subsystem === 'tracker' && rr_column === 'pixel') {
          rr_subsystem = 'pixel';
        }
        if (rr_subsystem === 'tracker' && rr_column === 'track') {
          rr_subsystem = 'track';
        }
        if (typeof subsystem_already_added[rr_subsystem] === 'undefined') {
          inclusive_loss += val;
          if (typeof inclusive_losses[rr_subsystem] === 'undefined') {
            inclusive_losses[rr_subsystem] = val;
            inclusive_losses_runs[rr_subsystem] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            inclusive_losses[rr_subsystem] =
              inclusive_losses[rr_subsystem] + val;
            inclusive_losses_runs[rr_subsystem] = add_jsons_fast(
              inclusive_losses_runs[rr_subsystem],
              runs_lumisections_responsible_for_rule[key]
            );
          }
          subsystem_already_added[rr_subsystem] = true;
        }
      });

      dcs_only.forEach((dcs_name) => {
        // We need to find to which subsystem does this dcs rule belong to:
        const subsystem = getWhichSubsystemDCSBelongsTo(dcs_name, dcs_mapping);
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

    // Exclusive losses
    let exclusive_losses = {
      mixed: 0,
      tracker_hv: 0,
    };
    let exclusive_losses_runs = { mixed: {} };
    let exclusive_loss = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      let loss_added = false;

      if (!loss_added) {
        const strip_dcs_bits = tracker_mapping['strip'];
        const pixel_dcs_bits = tracker_mapping['pixel'];
        // For tracker_hv to be added it must be at least one from strip and at least 1 from pixel:
        const number_of_dcs_bits_in_strip = dcs_only.filter((dcs_bit) =>
          strip_dcs_bits.includes(dcs_bit)
        ).length;
        const number_of_dcs_bits_in_pixel = dcs_only.filter((dcs_bit) =>
          pixel_dcs_bits.includes(dcs_bit)
        ).length;
        if (
          number_of_dcs_bits_in_strip > 0 &&
          number_of_dcs_bits_in_pixel > 0
        ) {
          loss_added = true;
          exclusive_losses['tracker_hv'] += val;
          exclusive_losses_runs['tracker_hv'] = add_jsons_fast(
            exclusive_losses_runs['tracker_hv'],
            runs_lumisections_responsible_for_rule[key]
          );
        }
      }
      // We check that the loss hasn't been added and that there are ONLY rules failing belonging to Run Registry or OMS, if by some chance another rule appeared which belongs to other criteria it shouldn't be attributed here
      if (!loss_added && dcs_only.length + rr_only.length === vars.length) {
        for (const [subsystem, dcs_bits] of Object.entries(dcs_mapping)) {
          // We don't check for >0 in dcs_only or rr_only since we are checking before for dcs_only + rr_only is all there is
          const only_dcs_bits_from_this_subystem =
            dcs_only.length > 0 &&
            dcs_only.every((dcs_bit) => dcs_bits.includes(dcs_bit));
          const only_rr_from_this_subystem =
            rr_only.length > 0 &&
            rr_only.every((rr_rule) => {
              let [rr_subsystem, rr_column] = rr_rule.split('-');
              if (rr_subsystem === 'ecal' && rr_column === 'es') {
                rr_subsystem = 'es';
              }
              if (rr_subsystem === 'tracker' && rr_column === 'strip') {
                rr_subsystem = 'strip';
              }
              if (rr_subsystem === 'tracker' && rr_column === 'pixel') {
                rr_subsystem = 'pixel';
              }
              if (rr_subsystem === 'tracker' && rr_column === 'track') {
                rr_subsystem = 'track';
              }
              return rr_subsystem === subsystem;
            });
          if (only_dcs_bits_from_this_subystem || only_rr_from_this_subystem) {
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
      }

      if (!loss_added) {
        loss_added = true;
        exclusive_losses['mixed'] += val;
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

    // Exclusive losses dcs

    let exclusive_losses_dcs = {
      tracker_hv: 0,
    };
    let exclusive_losses_dcs_runs = {};
    let exclusive_loss_dcs = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
    )) {
      const vars = getVars(key);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      let loss_added = false;

      if (!loss_added) {
        const strip_dcs_bits = tracker_mapping['strip'];
        const pixel_dcs_bits = tracker_mapping['pixel'];
        // For tracker_hv to be added it must be at least one from strip and at least 1 from pixel:
        const number_of_dcs_bits_in_strip = dcs_only.filter((dcs_bit) =>
          strip_dcs_bits.includes(dcs_bit)
        ).length;
        const number_of_dcs_bits_in_pixel = dcs_only.filter((dcs_bit) =>
          pixel_dcs_bits.includes(dcs_bit)
        ).length;
        if (
          number_of_dcs_bits_in_strip > 0 &&
          number_of_dcs_bits_in_pixel > 0
        ) {
          loss_added = true;
          exclusive_losses_dcs['tracker_hv'] += val;
          exclusive_losses_dcs_runs['tracker_hv'] = add_jsons_fast(
            exclusive_losses_dcs_runs['tracker_hv'],
            runs_lumisections_responsible_for_rule[key]
          );
        }
      }

      if (!loss_added) {
        for (const [subsystem, dcs_bits] of Object.entries(dcs_mapping)) {
          const only_dcs_bits_from_this_subystem = isSubsetOf(
            dcs_only,
            dcs_bits
          );
          if (only_dcs_bits_from_this_subystem) {
            loss_added = true;
            exclusive_loss_dcs += val;
            if (typeof exclusive_losses_dcs[subsystem] === 'undefined') {
              exclusive_losses_dcs[subsystem] = val;
              exclusive_losses_dcs_runs[subsystem] =
                runs_lumisections_responsible_for_rule[key];
            } else {
              exclusive_losses_dcs[subsystem] += val;
              exclusive_losses_dcs_runs[subsystem] = add_jsons_fast(
                exclusive_losses_dcs_runs[subsystem],
                runs_lumisections_responsible_for_rule[key]
              );
            }
          }
        }
      }
    }

    // Exclusive losses dcs per dcs bit
    let exclusive_losses_dcs_per_bit = {};
    let exclusive_losses_dcs_per_bit_runs = {};
    let exclusive_loss_dcs_per_bit = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
    )) {
      const vars = getVars(key);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      if (vars.length === dcs_only.length && vars.length === 1) {
        dcs_only.forEach((dcs_name) => {
          exclusive_loss_dcs_per_bit += val;
          if (typeof exclusive_losses_dcs_per_bit[dcs_name] === 'undefined') {
            exclusive_losses_dcs_per_bit[dcs_name] = val;
            exclusive_losses_dcs_per_bit_runs[dcs_name] =
              runs_lumisections_responsible_for_rule[key];
          } else {
            exclusive_losses_dcs_per_bit[dcs_name] =
              exclusive_losses_dcs_per_bit[dcs_name] + val;
            exclusive_losses_dcs_per_bit_runs[dcs_name] = add_jsons_fast(
              exclusive_losses_dcs_per_bit_runs[dcs_name],
              runs_lumisections_responsible_for_rule[key]
            );
          }
        });
      }
    }

    // Exclusive losses
    let exclusive_losses_rr = { mixed: 0 };
    let exclusive_losses_rr_runs = { mixed: {} };
    let exclusive_loss_rr = 0;
    for (const [key, val] of Object.entries(
      rules_flagged_false_combination_without_short_runs
    )) {
      const vars = getVars(key);
      const rr_only = vars
        .filter((name) => name.includes('.rr.'))
        .map((name) => name.split('.rr.')[1]);

      const dcs_only = vars
        .filter((name) => name.includes('.oms.'))
        .map((name) => name.split('.oms.')[1]);

      let loss_added;
      if (!loss_added && dcs_only.length === 0) {
        for (const [subsystem, dcs_bits] of Object.entries(dcs_mapping)) {
          const only_rr_from_this_subystem =
            rr_only.length > 0 &&
            rr_only.every((rr_rule) => {
              let [rr_subsystem, rr_column] = rr_rule.split('-');
              if (rr_subsystem === 'ecal' && rr_column === 'es') {
                rr_subsystem = 'es';
              }
              if (rr_subsystem === 'tracker' && rr_column === 'strip') {
                rr_subsystem = 'strip';
              }
              if (rr_subsystem === 'tracker' && rr_column === 'pixel') {
                rr_subsystem = 'pixel';
              }
              if (rr_subsystem === 'tracker' && rr_column === 'track') {
                rr_subsystem = 'track';
              }
              return rr_subsystem === subsystem;
            });
          if (only_rr_from_this_subystem) {
            loss_added = true;
            exclusive_loss_rr += val;
            if (typeof exclusive_losses_rr[subsystem] === 'undefined') {
              exclusive_losses_rr[subsystem] = val;
              exclusive_losses_rr_runs[subsystem] =
                runs_lumisections_responsible_for_rule[key];
            } else {
              exclusive_losses_rr[subsystem] =
                exclusive_losses_rr[subsystem] + val;
              exclusive_losses_rr_runs[subsystem] = add_jsons_fast(
                exclusive_losses_rr_runs[subsystem],
                runs_lumisections_responsible_for_rule[key]
              );
            }
          }
        }
      }
      // If the loss wasn't added and there is still some quality of RR it means there should be more than 1 subsystem, therefore it should go into the mixed category
      if (!loss_added && rr_only.length > 0 && dcs_only.length === 0) {
        loss_added = true;
        exclusive_losses_rr['mixed'] += val;
        exclusive_losses_rr_runs['mixed'] = add_jsons_fast(
          exclusive_losses_rr_runs['mixed'],
          runs_lumisections_responsible_for_rule[key]
        );
      }
    }

    short_runs_losses = this.transform_data_to_recharts(short_runs_losses);
    short_runs_exclusive_losses = this.transform_data_to_recharts(
      short_runs_exclusive_losses
    );
    dcs_lumi_losses = this.transform_data_to_recharts(dcs_lumi_losses);
    subsystem_dcs_losses = this.transform_data_to_recharts(
      subsystem_dcs_losses
    );
    rr_lumi_losses = this.transform_data_to_recharts(rr_lumi_losses);
    subsystem_rr_losses = this.transform_data_to_recharts(subsystem_rr_losses);
    inclusive_losses = this.transform_data_to_recharts(inclusive_losses);
    exclusive_losses = this.transform_data_to_recharts(exclusive_losses);
    exclusive_losses_dcs = this.transform_data_to_recharts(
      exclusive_losses_dcs
    );
    exclusive_losses_rr = this.transform_data_to_recharts(exclusive_losses_rr);
    exclusive_losses_dcs_per_bit = this.transform_data_to_recharts(
      exclusive_losses_dcs_per_bit
    );

    rules_flagged_false_quantity_luminosity = this.transform_data_to_recharts(
      rules_flagged_false_quantity_luminosity
    );
    rules_flagged_false_combination_luminosity = this.transform_data_to_recharts(
      rules_flagged_false_combination_luminosity
    );
    this.setState({
      rules_flagged_false_quantity_luminosity,
      rules_flagged_false_combination_luminosity,

      short_runs_losses,
      short_runs_exclusive_losses,
      dcs_lumi_losses,
      subsystem_dcs_losses,
      rr_lumi_losses,
      subsystem_rr_losses,
      inclusive_losses,
      exclusive_losses,
      exclusive_losses_dcs,
      exclusive_losses_rr,
      exclusive_losses_dcs_per_bit,

      short_runs_runs,
      short_runs_exclusive_runs,
      dcs_lumi_losses_runs,
      subsystem_dcs_losses_runs,
      rr_lumi_losses_runs,
      subsystem_rr_losses_runs,
      inclusive_losses_runs,
      exclusive_losses_runs,
      exclusive_losses_dcs_runs,
      exclusive_losses_rr_runs,
      exclusive_losses_dcs_per_bit_runs,

      short_runs_total,
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
      total_recorded_luminosity,
      total_delivered_luminosity,
      recorded_luminosity_in_json,
      delivered_luminosity_in_json,
      total_recorded_luminosity_lost,
      total_delivered_luminosity_lost,
      total_recorded_luminosity_from_run_range,
      total_delivered_luminosity_from_run_range,
    } = this.props.selected_json;

    const {
      rules_flagged_false_quantity_luminosity,
      rules_flagged_false_combination_luminosity,

      short_runs_losses,
      short_runs_exclusive_losses,
      dcs_lumi_losses,
      subsystem_dcs_losses,
      rr_lumi_losses,
      subsystem_rr_losses,
      inclusive_losses,
      exclusive_losses,
      exclusive_losses_dcs,
      exclusive_losses_rr,
      exclusive_losses_dcs_per_bit,

      short_runs_total,

      short_runs_runs,
      short_runs_exclusive_runs,
      dcs_lumi_losses_runs,
      subsystem_dcs_losses_runs,
      rr_lumi_losses_runs,
      subsystem_rr_losses_runs,
      inclusive_losses_runs,
      exclusive_losses_runs,
      exclusive_losses_dcs_runs,
      exclusive_losses_rr_runs,
      exclusive_losses_dcs_per_bit_runs,
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
        <br />
        <br />
        <br />
        <br />
        <center>
          <div style={{ display: 'flex' }}>
            <div>
              <h4>
                <strong>(EXPERIMENTAL)</strong> LHC delivered (including runs
                that were not signed off):{' '}
                {total_delivered_luminosity_from_run_range}/pb
              </h4>
              <Delta
                value={
                  total_delivered_luminosity_from_run_range -
                  total_recorded_luminosity_from_run_range
                }
                reason="Luminosity lost within runs that were not signed off (delivered - recorded)"
              />
              <h4>
                Leaving a total of recorded luminosity (including runs not
                signed off): {total_recorded_luminosity_from_run_range}/pb
              </h4>
            </div>
            <div>
              <h4>
                <strong>(Experimental) </strong>LHC recorded (including runs not
                signed off): {total_recorded_luminosity_from_run_range}/pb
              </h4>
              <Delta
                value={
                  total_recorded_luminosity_from_run_range -
                  total_recorded_luminosity
                }
                reason="(recorded from whole run list, including runs that were not signed off) - (recorded within runs that were signed off)"
              />
              <h4>
                Total recorded luminosity (within runs signed off) is:{' '}
                {total_recorded_luminosity}/pb
              </h4>
            </div>
          </div>
          <hr />
          <div style={{ display: 'flex' }}>
            <div>
              <h4>
                LHC delivered (within runs signed off):{' '}
                {total_delivered_luminosity}/pb
              </h4>
              <Delta
                value={total_delivered_luminosity - total_recorded_luminosity}
                reason="(downtime & dead time)"
              />
              <h4>
                Total recorded luminosity (within runs signed off) is:{' '}
                {total_recorded_luminosity}/pb
              </h4>
            </div>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div>
              <h4>CMS recorded: {total_recorded_luminosity}/pb</h4>
              <Delta
                value={short_runs_total}
                reason="(commissioning/short/special/50ns/lowpu)"
              />
              <h4>
                Leaving a total of:{' '}
                {total_recorded_luminosity - short_runs_total}/pb{' '}
              </h4>
              <p>
                Every lumisection that had a rule that did not pass for any of
                the attributes that classify in the short_run category, will
                account to this loss, even if other rules (like HV or quality)
                failed.
              </p>
              <p>Attributes that classify as short_run attributes:</p>
              <i>
                {Object.entries(short_runs_mapping)
                  .map((attributes) => attributes[1].join(', '))
                  .join(', ')}
              </i>
            </div>
            <div>
              <PieChartAndBarChart
                title={`Visualizing ${short_runs_total} loses due to 'short runs' attributes (inclusive)`}
                data={short_runs_losses}
                runs={short_runs_runs}
              />
            </div>
          </div>
          <hr />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <h4>
                CMS Recorded and processed by DC team:{' '}
                {total_recorded_luminosity - short_runs_total} {' - '}{' '}
                {total_recorded_luminosity_lost}
              </h4>
              <Delta
                value={total_recorded_luminosity - short_runs_total}
                reason="(Quality flags: data marked as BAD, and HV losses)"
              />
              <h4>
                Leaving a total of:{' '}
                {total_recorded_luminosity - short_runs_total}/pb{' '}
              </h4>
            </div>
            <div>
              <PieChartAndBarChart
                title="Exclusive losses per Subsystem (both DCS and Quality per Subsystem)"
                data={exclusive_losses}
                runs={exclusive_losses_runs}
              />
            </div>
          </div>
          <br />
          <PieChartAndBarChart
            title="Exclusive losses accountable for any of the Short run categories"
            data={short_runs_exclusive_losses}
            runs={short_runs_exclusive_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Exclusive losses per Subsystem (both DCS and Quality per Subsystem)"
            data={exclusive_losses}
            runs={exclusive_losses_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Exclusive losses (only DCS per subsystem)"
            data={exclusive_losses_dcs}
            runs={exclusive_losses_dcs_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Exclusive losses (only DCS)"
            data={exclusive_losses_dcs_per_bit}
            runs={exclusive_losses_dcs_per_bit_runs}
          />
          <br />
          <PieChartAndBarChart
            title="Exclusive losses (only Quality per subsystem)"
            data={exclusive_losses_rr}
            runs={exclusive_losses_rr_runs}
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
          <br />
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
