const config = {
    development: {
        root_url_prefix: '',
        root_url: ''
    },
    test: {
        root_url_prefix: '/runtest/',
        root_url: ''
    },
    production: {
        root_url_prefix: '',
        root_url: ''
    }
};

export const root_url_prefix =
    config[process.env.NODE_ENV || 'development']['root_url_prefix'];

export default config;
