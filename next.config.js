/* eslint-disable */
const withCss = require('@zeit/next-css');
const root_url_prefix = require('./config/config').root_url_prefix;
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {};
}
module.exports = withCss({
    assetPrefix: root_url_prefix, // affects page bundles and app/commons/vendor scripts
    webpack: (config, { defaultLoaders }) => {
        config.output.publicPath = `/${root_url_prefix}${
            config.output.publicPath
        }`; // affects 'chunks'
        return config;
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
        NODE_ENV: process.env.NODE_ENV,
        ENV: process.env.ENV
    }
});
