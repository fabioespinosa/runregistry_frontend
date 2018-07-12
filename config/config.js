const config = {
    development: {
        root_url_prefix: '',
        root_url: '',
        api_url: 'http://localhost:7002'
    },
    test: {
        root_url_prefix: '/runtest',
        root_url: '',
        api_url: 'https://cms-pdmv-dev.cern.ch/runregistry_api'
    },
    production: {
        root_url_prefix: '',
        root_url: ''
    }
};

module.exports =
    process.env.NODE_ENV === 'test'
        ? config['test']
        : process.env.NODE_ENV === 'production'
            ? config['production']
            : config['development'];

console.log(module.exports);
