const fs = require('fs');
const express = require('express');
const next = require('next');

const http = require('http');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const http_port = process.env.PORT || 7001;
const https_port = process.env.HTTPS_PORT || 7000;

const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

const server_options = {
    key: privateKey,
    cert: certificate
};

app.prepare().then(() => {
    const server = express();
    // const router = express.Router();

    // Redirects primary url to runs/all
    server.get('/', (req, res) => {
        // There are two `production` scenarios, either real production or staging
        if (process.env.NODE_ENV === 'production') {
            if (process.env.ENV === 'production') {
                res.redirect('/online/runs/all');
            } else if (process.env.ENV === 'staging') {
                res.redirect('/online/runs/all');
            }
        } else {
            res.redirect('/online/runs/all');
        }
    });

    // offline:
    server.get('/:type/:section/:workspace', (req, res) => {
        const params = { ...req.headers, ...req.params, filters: req.query };
        app.render(req, res, `/${req.params.type}`, params);
    });

    server.get('/:type/:section', (req, res) => {
        const params = { ...req.headers, ...req.params, filters: req.query };
        app.render(req, res, `/${req.params.type}`, params);
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    // server.use('/runtest', router);

    const https_server = https.createServer(server_options, server);
    https_server.listen(https_port, '0.0.0.0', err => {
        if (err) throw err;
        console.log(`> HTTPS listening in port ${https_port}`);
    });

    const http_server = http.createServer(server_options, server);
    http_server.listen(http_port, '0.0.0.0', err => {
        if (err) throw err;
        console.log(`> HTTP listening in port ${http_port}`);
    });
    // server.listen(port, err => {
    //     if (err) throw err;
    //     console.log(`> Ready on http://localhost:${port}`);
    // });
});
