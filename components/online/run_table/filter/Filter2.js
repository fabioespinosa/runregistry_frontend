import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';
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

const DatasetTripletCache = [
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

const run_fields = [
  { name: 'run_number', label: 'run_number' },
  ...rr_attributes.map(rr_attribute => ({
    name: `rr_attributes.${rr_attribute}`,
    label: rr_attribute
  })),
  ...oms_attributes.map(oms_attribute => ({
    name: `oms_attributes.${oms_attribute}`,
    label: oms_attribute
  })),
  ...DatasetTripletCache.map(triplet => ({
    name: `DatasetTripletCache.${triplet}`,
    label: triplet
  }))
];

const formatSequelize = rules => {
  console.log(rules);
  // debugger;
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

const starting_query = {
  rules: [
    {
      field: 'run_number',
      operator: '>',
      value: '34322'
    },
    {
      field: 'rr_attributes.significant',
      operator: '=',
      value: false
    }
  ],
  combinator: 'and',
  not: false
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
  if (field.startsWith('DatasetTripletCache')) {
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
  // { name: 'in', label: 'in' },
  // { name: 'notIn', label: 'not in' },
  { name: '=', label: '=' },
  { name: '<>', label: '!=' },
  { name: '<', label: '<' },
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' },
  { name: 'like', label: 'like' },
  { name: 'notlike', label: 'notlike' }
];

const getValues = (field, operator) => {
  if (field.startsWith('DatasetTripletCache')) {
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

const RootView = () => {
  // const router = useRouter();
  const [query, setQuery] = useState(starting_query);
  const [fields, setFields] = useState(run_fields);
  const [format, setFormat] = useState('json');
  const [
    showCombinatorsBetweenRules,
    setShowCombinatorsBetweenRules
  ] = useState(false);
  const [showNotToggle, setShowNotToggle] = useState(false);
  const [resetOnFieldChange, setResetOnFieldChange] = useState(true);

  const handleQueryChange = query => {
    // router.push(Router.pathname, `?top=${query}`, { shallow: true });
    // Set url here
    setQuery(query);
  };

  return (
    <div className="flex-box-outer">
      <div className="flex-box">
        <div className="scroll">
          <QueryBuilder
            query={query}
            fields={fields}
            controlClassnames={{ fields: 'form-control' }}
            onQueryChange={handleQueryChange}
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
        <div className="shrink query-log scroll">
          <h4>Options</h4>
          <div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showCombinatorsBetweenRules}
                  onChange={e =>
                    setShowCombinatorsBetweenRules(e.target.checked)
                  }
                />
                Show combinators between rules
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showNotToggle}
                  onChange={e => setShowNotToggle(e.target.checked)}
                />
                Show "not" toggle
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={resetOnFieldChange}
                  onChange={e => setResetOnFieldChange(e.target.checked)}
                />
                Reset rule on field change
              </label>
            </div>
          </div>
          <h4>Query</h4>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <label>
              <input
                type="radio"
                checked={format === 'json'}
                onChange={() => setFormat('json')}
              />
              JSON
            </label>
            <label>
              <input
                type="radio"
                checked={format === 'sql'}
                onChange={() => setFormat('sql')}
              />
              SQL
            </label>
          </div>
          <pre>{JSON.stringify(formatSequelize([query]), null, 2)}</pre>
          <pre>{formatQuery(query, format)}</pre>
        </div>
      </div>
      <style jsx global>{`
        .ruleGroup {
          background-color: white;
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
          border-left: 2px solid #00bcd4;
          padding: 1rem;
        }
        .ruleGroup .ruleGroup {
          border-left: 2px solid #8bc34a;
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
          padding: 6px 12px;
        }
        .ruleGroup-remove,
        .rule-remove {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default RootView;
