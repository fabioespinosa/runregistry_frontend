import React, { Component, useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { debounce } from 'throttle-debounce';
import qs from 'qs';
import QueryBuilder, { formatQuery } from 'react-querybuilder';
import 'react-querybuilder/src/query-builder.scss';

const oms_attributes = [
  'energy',
  'l1_key',
  'b_field',
  'hlt_key',
  'l1_menu',
  'l1_rate',
  'duration',
  'end_lumi',
  'end_time',
  'sequence',
  'init_lumi',
  'clock_type',
  'components',
  'run_number',
  'start_time',
  'dt_included',
  'es_included',
  'fill_number',
  'hf_included',
  'l1_hlt_mode',
  'last_update',
  'ls_duration',
  'stable_beam',
  'cow_included',
  'csc_included',
  'daq_included',
  'dcs_included',
  'dqm_included',
  'gem_included',
  'ltc_included',
  'rpc_included',
  'trg_included',
  'trigger_mode',
  'cmssw_version',
  'ecal_included',
  'efed_included',
  'hcal_included',
  'lumi_included',
  'recorded_lumi',
  'scal_included',
  'tcds_included',
  'ctpps_included',
  'delivered_lumi',
  'pixel_included',
  'tier0_transfer',
  'totem_included',
  'castor_included',
  'hflumi_included',
  'l1_key_stripped',
  'dt_efed_included',
  'fill_type_party1',
  'fill_type_party2',
  'hlt_physics_rate',
  'hlt_physics_size',
  'injection_scheme',
  'tracker_included',
  'csc_efed_included',
  'fill_type_runtime',
  'pixel_up_included',
  'rpc_efed_included',
  'trg_efed_included',
  'ctpps_tot_included',
  'ecal_efed_included',
  'hcal_efed_included',
  'hlt_physics_counter',
  'l1_triggers_counter',
  'l1_hlt_mode_stripped',
  'tracker_efed_included',
  'hlt_physics_throughput',
  'initial_prescale_index',
  'beams_present_and_stable'
];

const rr_attributes = [
  'class',
  'state',
  'short_run',
  'significant',
  'stop_reason'
];

const triplet_summary = [
  'dt-dt',
  'rpc-hv',
  'rpc-lv',
  'cms-cms',
  'csc-csc',
  'csc-mem',
  'csc-mep',
  'ecal-es',
  'hcal-hb',
  'hcal-he',
  'hcal-hf',
  'hlt-hlt',
  'hlt-tau',
  'l1t-jet',
  'l1t-l1t',
  'rpc-feb',
  'rpc-rpc',
  'tau-tau',
  'csc-ddus',
  'ecal-ebm',
  'ecal-ebp',
  'ecal-eem',
  'ecal-eep',
  'ecal-esm',
  'ecal-esp',
  'ecal-tpg',
  'hcal-ho0',
  'l1t-muon',
  'rpc-elog',
  'btag-btag',
  'csc-csctf',
  'ecal-ecal',
  'hcal-hbls',
  'hcal-hcal',
  'hcal-hels',
  'hcal-hfls',
  'hcal-ho12',
  'hlt-bjets',
  'hlt-muons',
  'l1t-l1tmu',
  'lumi-lumi',
  'muon-muon',
  'rpc-noise',
  'csc-strips',
  'csc-timing',
  'ecal-laser',
  'ecal-noise',
  'hcal-ho0ls',
  'hlt-global',
  'hlt-jetmet',
  'ctpps-ctpps',
  'ecal-timing',
  'hcal-ho12ls',
  'hlt-photons',
  'l1t-e_gamma',
  'l1t-hf_tech',
  'l1t-l1tcalo',
  'l1t-muon_dt',
  'csc-gasgains',
  'csc-segments',
  'l1t-bcs_tech',
  'l1t-hf_rings',
  'l1t-muon_csc',
  'l1t-muon_rpc',
  'l1t-rpc_tech',
  'l1t-software',
  'castor-castor',
  'csc-integrity',
  'csc-occupancy',
  'csc-pedestals',
  'csc-triggerpe',
  'ecal-analysis',
  'egamma-egamma',
  'hlt-electrons',
  'hlt-technical',
  'jetmet-jetmet',
  'l1t-bptx_tech',
  'tracker-pixel',
  'tracker-strip',
  'csc-efficiency',
  'csc-resolution',
  'ctpps-rp45_210',
  'ctpps-rp45_220',
  'ctpps-rp45_cyl',
  'ctpps-rp56_210',
  'ctpps-rp56_220',
  'ctpps-rp56_cyl',
  'ecal-preshower',
  'ecal-collisions',
  'l1t-energy_sums',
  'ctpps-time45_box',
  'ctpps-time56_box',
  'tracker-tracking'
];

// const fields = [
//   { name: 'run_number', label: 'run_number' },
//   ...rr_attributes.map(rr_attribute => ({
//     name: `rr_attributes.${rr_attribute}`,
//     label: rr_attribute
//   })),
//   ...oms_attributes.map(oms_attribute => ({
//     name: `oms_attributes.${oms_attribute}`,
//     label: oms_attribute
//   })),
//   ...triplet_summary.map(triplet => ({
//     name: `${triplet}`,
//     label: triplet
//   }))
// ];

const formatSequelize = rules => {
  if (rules) {
    const sequelize_filter = [];
    for (const rule of rules) {
      const { combinator, rules } = rule;
      if (combinator) {
        sequelize_filter.push({ [combinator]: formatSequelize(rules) });
      } else {
        sequelize_filter.push({
          [rule.field]: {
            [rule.operator]: rule.value
          }
        });
      }
    }
    return sequelize_filter;
  }
};

const removeIdsFromQuery = query => {
  const query_copy = { ...query };
  delete query_copy.id;
  if (query_copy.rules) {
    query_copy.rules = query_copy.rules.map(rule => removeIdsFromQuery(rule));
  }
  return query_copy;
};

const processQuery = (query, valueProcessor) => {
  if (!valueProcessor) {
    valueProcessor = value => value;
  }
  const query_copy = { ...query };
  query_copy.rules = query.rules.map(rule => {
    if (rule.rules) {
      return processQuery(rule, valueProcessor);
    }
    return valueProcessor(rule);
  });
  return query_copy;
};

const getOperators = field => {
  switch (field) {
    case 'rr_attributes.significant':
      return [{ name: '=', label: 'is' }];

    default:
      return null;
  }
};

const getValueEditorType = (field, operator) => {
  if (field && field.startsWith('triplet_summary')) {
    return 'select';
  }
  switch (field) {
    case 'rr_attributes.significant':
      return 'checkbox';
    default:
      return 'text';
  }
};

const getInputType = (field, operator) => {
  switch (field) {
    case 'rr_attributes.significant':
      return 'checkbox';
    default:
      return 'text';
  }
};

const operators = [
  // { name: 'null', label: 'is null' },
  // { name: 'notNull', label: 'is not null' },

  // { name: 'notIn', label: 'not in' },
  { name: '=', label: '=' },
  { name: '<>', label: '!=' },
  { name: '<', label: '<' },
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' },
  { name: 'in', label: 'in' },
  { name: 'like', label: 'like' },
  { name: 'notlike', label: 'notlike' }
];

const getValues = (field, operator) => {
  if (field && field.startsWith('triplet_summary')) {
    return [
      { name: 'GOOD', label: 'GOOD' },
      { name: 'BAD', label: 'BAD' },
      { name: 'STANDBY', label: 'STANDBY' },
      { name: 'EXCLUDED', label: 'EXCLUDED' },
      { name: 'NOTSET', label: 'NOTSET' },
      { name: 'NO VALUE FOUND', label: 'NO VALUE FOUND' }
    ];
  }
  switch (field) {
    case 'gender':
      return [
        { name: 'M', label: 'Male' },
        { name: 'F', label: 'Female' },
        { name: 'O', label: 'Other' }
      ];

    default:
      return [];
  }
};

class RootView extends Component {
  constructor(props) {
    super(props);
    this.handleQueryChangeDebounced = debounce(390, this.handleQueryChange);
    this.state = { initialQuery: true };
  }
  state = {
    initialQuery: false
  };

  componentWillMount() {
    const { filters } = Router.query;
    // For top table it is 'top', for bottom table it is 'bottom'
    const { prefix_from_url } = this.props;
    if (filters) {
      const query = filters[prefix_from_url];
      if (query) {
        this.setState({ query });
      }
    }
  }
  componentDidMount() {
    setTimeout(this.setInputWidths, 800);
  }

  setInputWidths() {
    document.querySelectorAll('input.rule-value').forEach(node => {
      const text_length = node.value.length;
      if (text_length < 20) {
        node.size = 20;
      } else {
        node.size = parseInt(text_length * 1.105);
      }
    });
  }

  generateFields = (table_columns, other_columns) => {
    return [...table_columns, ...other_columns];
  };

  handleQueryChange = async query => {
    const { filters } = Router.query;
    const { filterTable, valueProcessor, prefix_from_url } = this.props;
    const query_without_ids = removeIdsFromQuery(query);

    let { asPath } = Router;
    if (asPath.includes('?')) {
      asPath = asPath.split('?')[0];
    }
    let url_query = qs.stringify({
      ...filters,
      [prefix_from_url]: query_without_ids
    });
    if (query.rules.length === 0) {
      const new_filter = { ...filters };
      delete new_filter[prefix_from_url];
      url_query = qs.stringify(new_filter);
    }

    history.pushState({}, '', `${asPath}?${url_query}`);
    const processed_query = processQuery(query_without_ids, valueProcessor);
    const formated_filters = formatSequelize([processed_query])[0];
    // 0 is for the page number:
    await filterTable(formated_filters, 0);
    this.setState({ initialQuery: false });
    // Router.push(asPath, `${asPath}?${url_query}`, {
    //   shallow: true
    // });
  };

  render() {
    const { table_columns, other_columns, setParentLoading } = this.props;
    const fields = this.generateFields(table_columns, other_columns);
    const { query, initialQuery } = this.state;
    const showCombinatorsBetweenRules = false;
    const showNotToggle = false;
    const resetOnFieldChange = false;

    return (
      <div className="flex-box-outer">
        <div className="flex-box">
          <div className="scroll">
            <QueryBuilder
              query={query}
              fields={fields}
              controlClassnames={{ fields: 'form-control' }}
              onQueryChange={async query => {
                // Make text fit the input:
                this.setInputWidths();
                if (initialQuery) {
                  setParentLoading(true);
                  try {
                    await this.handleQueryChange(query);
                  } catch (e) {
                    setParentLoading(false);
                  }
                  setParentLoading(false);
                } else {
                  this.handleQueryChangeDebounced(query);
                }
              }}
              getOperators={getOperators}
              getValueEditorType={getValueEditorType}
              getInputType={getInputType}
              getValues={getValues}
              showCombinatorsBetweenRules={showCombinatorsBetweenRules}
              showNotToggle={showNotToggle}
              resetOnFieldChange={resetOnFieldChange}
              operators={operators}
            />
          </div>
        </div>
        <style jsx global>{`
          .ruleGroup {
            background-color: white !important;
          }
          .ruleGroup,
          .ruleGroup .ruleGroup,
          .ruleGroup .rule {
            border-radius: 4px;
            border: 1px solid #ddd;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
          }
          .ruleGroup .rule {
            background-color: #f5f5f5;
            border-left: 7px solid #00bcd4;
            padding: 0.8rem;
          }
          .ruleGroup .ruleGroup {
            border-left: 7px solid #8bc34a;
          }
          .ruleGroup-remove,
          .rule-remove {
            float: right;
          }
          .ruleGroup-combinators,
          .ruleGroup-addRule,
          .ruleGroup-addGroup,
          .rule-fields,
          .rule-operators,
          .rule-value {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 3px 12px;
            margin-left: 8px;
          }
          .ruleGroup-remove,
          .rule-remove {
            background: transparent;
            border: none;
            border-radius: 3px;
            color: white;
            background-color: #e74c3c;
            padding: 0px 6px;
            font-weight: bolder;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}

export default RootView;
