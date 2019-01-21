/* eslint-disable */
const withCss = require('@zeit/next-css');
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {};
}
module.exports = withCss({
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
        NODE_ENV: process.env.NODE_ENV,
        ENV: process.env.ENV
    }
});
