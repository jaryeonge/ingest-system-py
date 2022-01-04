const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/is',
        createProxyMiddleware({
            target: 'http://is-app-py:9090',
            changeOrigin: true,
        })
    );
};