/* eslint-disable */
const withCss = require('@zeit/next-css');

const prefix = '/runtest';

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {};
}

module.exports = withCss({
    assetPrefix: prefix, // affects page bundles and app/commons/vendor scripts
    webpack: config => {
        config.output.publicPath = `/${prefix}${config.output.publicPath}`; // affects 'chunks'
        return config;
    }
});
