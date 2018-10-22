/* eslint-disable */
const withCss = require('@zeit/next-css');
const root_url_prefix = require('./config/config').root_url_prefix;

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {};
}
console.log(process.env.NODE_ENV);
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
        NODE_ENV: process.env.NODE_ENV
    }
});
