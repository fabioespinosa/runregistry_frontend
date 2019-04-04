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
        root_url: '',
        api_url: 'http://localhost:9500'
    },
    staging: {
        root_url: '',
        api_url: 'https://dev-cmsrunregistry.web.cern.ch/api'
    },
    production: {
        root_url: '',
        api_url: 'https://cmsrunregistry.web.cern.ch/api'
    }
};
exports.config = config;

exports.api_url = config[ENV]['api_url'];

// If adding a new subsystem (like say adding ECAL), add it in components and in rr_attributes with the ending _triplet
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
    'l1tmu',
    'lumi',
    'pix',
    'rpc',
    'strip'
];

exports.rr_attributes = [
    'class',
    'state',
    'significant',
    'stop_reason'
    // 'dt_triplet',
    // 'es_triplet',
    // 'cms_triplet',
    // 'csc_triplet',
    // 'hlt_triplet',
    // 'l1t_triplet',
    // 'pix_triplet',
    // 'rpc_triplet',
    // 'ecal_triplet',
    // 'hcal_triplet',
    // 'lumi_triplet',
    // 'ctpps_triplet',
    // 'l1tmu_triplet',
    // 'strip_triplet',
    // 'castor_triplet',
    // 'l1tcalo_triplet'
];

const offline_column_structure =
    // None of the offline_column_structure can contain "-" character, only "_".
    {
        btag: ['btag'],
        castor: ['castor'],
        csc: [
            'csc',
            'occupancy',
            'integrity',
            'strips',
            'timing',
            'efficiency',
            'gasgains',
            'pedestals',
            'resolution',
            'segments',
            'tf',
            'triggergpe'
        ],
        ctpps: [
            'ctpps',
            'rp45_210',
            'rp45_220',
            'rp45_cyl',
            'rp56_210',
            'rp56_220',
            'rp56_cyl',
            'trk45_210',
            'time45',
            'trk56_220',
            'time56',
            'time_global'
        ],
        dt: ['dt'],
        ecal: [
            'ecal',
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
        egamma: ['egamma'],
        hcal: ['hb', 'he', 'hf', 'ho0', 'ho12'],
        hlt: [
            'muons',
            'electrons',
            'photons',
            'jetmet',
            'tau',
            'bjets',
            'technical'
        ],
        jetmet: ['jetmet'],
        l1t: ['l1tmu', 'l1tcalo', 'software'],
        lumi: ['lumi'],
        muon: ['muon'],
        rpc: ['rpc', 'hv', 'lv', 'feb', 'noise', 'elog'],
        tau: ['tau'],
        tracker: ['track', 'pix', 'strip']
    };

const columns = [];
for (const [key, val] of Object.entries(offline_column_structure)) {
    val.forEach(sub_column => {
        columns.push(`${key}-${sub_column}`);
    });
}
exports.offline_column_structure = offline_column_structure;
exports.offline_columns = columns;

// MISING LOWLUMI:
exports.certifiable_offline_components = {
    btag: ['btag'],
    castor: ['castor'],
    cms: ['cms'],
    csc: ['csc'],
    ctpps: ['ctpps'],
    dt: ['dt'],
    ecal: ['ecal', 'es'],
    egamma: ['egamma'],
    hcal: ['hcal'],
    hlt: ['hlt'],
    jetmet: ['jetmet'],
    l1t: ['l1tmu', 'l1tcalo'],
    lumi: ['lumi'],
    muon: ['muon'],
    rpc: ['rpc'],
    tau: ['tau'],
    tracker: ['track', 'pix', 'strip']
};

// exports.certifiable_offline_components = [
//     'btag',
//     'castor',
//     'cms',
//     'csc',
//     'ctpps',
//     'dt',
//     'ecal',
//     'egamma',
//     'es',
//     'hcal',
//     'hlt',
//     'jetmet',
//     'l1t',
//     'l1tcalo',
//     'l1tmu',
//     'lowLumi',
//     'lumi',
//     'muon',
//     'pix',
//     'rpc',
//     'strip',
//     'tau',
//     'track'
// ];

exports.lumisection_attributes = [
    'beam1_present',
    'beam1_stable',
    'beam2_present',
    'beam2_stable',
    'bpix_ready',
    'castor_ready',
    'cms_infrastructure',
    'cms_active',
    'cscm_ready',
    'cscp_ready',
    'dt0_ready',
    'dtm_ready',
    'dtp_ready',
    'ebm_ready',
    'ebp_ready',
    'eem_ready',
    'eep_ready',
    'esm_ready',
    'esp_ready',
    'fpix_ready',
    'hbhea_ready',
    'hbheb_ready',
    'hbhec_ready',
    'hf_ready',
    'ho_ready',
    'rp_sect_45_ready',
    'rp_sect_56_ready',
    'rp_time_ready',
    'rpc_ready',
    'tecm_ready',
    'tecp_ready',
    'tibtid_ready',
    'tob_ready',
    'zdc_ready'
];
