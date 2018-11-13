const getConfig = require('next/config');
const runtimeConfig = getConfig.default() || {
    publicRuntimeConfig: {
        NODE_ENV: process.env.NODE_ENV,
        ENV: process.env.ENV
    }
};
const publicRuntimeConfig = runtimeConfig.publicRuntimeConfig;
const { ENV, NODE_ENV } = publicRuntimeConfig;
console.log('Setup: ', NODE_ENV);
console.log('Environment: ', ENV);
const config = {
    development: {
        root_url_prefix: '',
        root_url: '',
        api_url: 'http://localhost:7003'
    },
    staging: {
        root_url_prefix: '/rr-dev',
        root_url: '',
        api_url: 'https://cms-pdmv-dev.cern.ch/rr-dev_api'
    },
    production: {
        root_url_prefix: '/runtest',
        root_url: '',
        api_url: 'https://cms-pdmv-dev.cern.ch/runtest_api'
    }
};
exports.config = config;
exports.root_url_prefix = config[ENV]['root_url_prefix'];

exports.api_url = config[ENV]['api_url'];

exports.components = [
    'cms',
    'castor',
    'csc',
    'ctpps',
    'dt',
    'ecal',
    'es',
    'hcal',
    'hlt',
    'l1t',
    'l1tcalo',
    'lumi',
    'pix',
    'rpc',
    'strip'
];

const offline_column_structure = {
    cms: [],
    btag: [],
    castor: [],
    csc: [
        'occupancy',
        'integrity',
        'strips',
        'timing',
        'efficiency',
        'gasgains',
        'resolution',
        'segments',
        'tf',
        'triggergpe'
    ],
    ctpps: ['rp45_220', 'rp45_cyl', 'rp56_210', 'rp56_220', 'rp56_cyl'],
    dt: [],
    ecal: [
        'ebp',
        'ebm',
        'eep',
        'eem',
        'es',
        'esp',
        'esm',
        'analysis',
        'collisions',
        'laser',
        'tpg',
        'noise',
        'preshower',
        'timing'
    ],
    egamma: [],
    hcal: [
        'hb',
        'he',
        'hf',
        'ho0',
        'ho12',
        'hb_ls',
        'he_ls',
        'hf_ls',
        'ho0_ls',
        'ho12_ls'
    ],
    hlt: [
        'bjets',
        'electrons',
        'jetmet',
        'muons',
        'photons',
        'tau',
        'technical'
    ],
    jetmet: [],
    l1t: [
        'bcs_tech',
        'bptx_tech',
        'e_gamma',
        'energy_sums',
        'hf_rings',
        'hf_tech',
        'l1tcalo',
        'l1tmu',
        'muon_csc',
        'muon_dt',
        'muon_rpc',
        'rpc_tech',
        'software'
    ],
    lumi: [],
    muon: [],
    rpc: ['rpc', 'hv', 'lv', 'feb', 'noise', 'elog'],
    tau: [],
    tracker: ['pix', 'strip', 'track']
};

const columns = [];
for (const [key, val] of Object.entries(offline_column_structure)) {
    columns.push(key);
    val.forEach(sub_column => {
        columns.push(`${key}_${sub_column}`);
    });
}
exports.offline_column_structure = offline_column_structure;
exports.offline_columns = columns;
