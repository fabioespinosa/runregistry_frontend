const config = {
    local: {
        root_url_prefix: '',
        root_url: '',
        api_url: 'http://localhost:7003'
    },
    development: {
        root_url_prefix: '',
        root_url: '',
        api_url: 'http://localhost:7003'
    },
    production: {
        root_url_prefix: '/runtest',
        root_url: '',
        api_url: 'https://cms-pdmv-dev.cern.ch/runtest_api'
    }
};
exports.root_url_prefix =
    config[process.env.NODE_ENV || 'development']['root_url_prefix'];

exports.api_url = config[process.env.NODE_ENV || 'development']['api_url'];

exports.components = [
    'cms',
    'castor',
    'csc',
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
    'strip',
    'ctpps'
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
        'hlt_global',
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

exports.offline_columns = columns;
