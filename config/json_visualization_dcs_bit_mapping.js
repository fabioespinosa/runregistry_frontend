exports.short_runs_mapping = {
  energy: ['energy'],
  b_field: ['b_field'],
  recorded_lumi: ['recorded_lumi'],
  beams: ['beam1_present', 'beam2_present', 'beam1_stable', 'beam2_stable'],
  injection_scheme: ['injection_scheme'],
  hlt_key: ['hlt_key'],
  cms_active: ['cms_active'],
  // include low pilup here
};

exports.dcs_mapping = {
  btag: [],
  castor: ['castor_ready'],
  cms: ['cms_active'],
  csc: ['cscm_ready', 'cscp_ready'],
  ctpps: ['ctpps'],
  dc: [],
  dt: ['dt0_ready', 'dtm_ready', 'dtp_ready'],
  ecal: ['ebm_ready', 'ebp_ready', 'eem_ready', 'eep_ready'],
  es: ['esm_ready', 'esp_ready'],
  egamma: [],
  hcal: ['hbhea_ready', 'hbheb_ready', 'hbhec_ready', 'hf_ready', 'ho_ready'],
  hlt: [],
  jetmet: [],
  l1t: [],
  lumi: [],
  muon: [],
  rpc: ['rpc_ready'],
  tau: [],
  strip: ['tibtid_ready', 'tecm_ready', 'tecp_ready', 'tob_ready'],
  pixel: ['fpix_ready', 'bpix_ready'],
  tracker: [],
  // tracker: [
  //   'fpix_ready',
  //   'bpix_ready',
  //   'tibtid_ready',
  //   'tecm_ready',
  //   'tecp_ready',
  //   'tob_ready',
  // ],
};

// If there is at least one of each, it accounts for TRACKER_HV
exports.tracker_mapping = {
  strip: ['tibtid_ready', 'tecm_ready', 'tecp_ready', 'tob_ready'],
  pixel: ['fpix_ready', 'bpix_ready'],
};
