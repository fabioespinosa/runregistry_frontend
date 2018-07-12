const config = {
    development2: {
        root_url_prefix: '',
        root_url: '',
        api_url: 'http://localhost:7002'
    },
    development: {
        root_url_prefix: '/runtest',
        root_url: '',
        api_url: 'https://cms-pdmv-dev.cern.ch/runtest_api'
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
