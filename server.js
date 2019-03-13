const fs = require('fs');
const express = require('express');
const next = require('next');

const http = require('http');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const http_port = process.env.PORT || 7001;

app.prepare().then(() => {
    const server = express();
    // const router = express.Router();

    // Redirects primary url to runs/all
    server.get('/offline', (req, res) => {
        // There are two `production` scenarios, either real production or staging
        if (process.env.NODE_ENV === 'production') {
            if (process.env.ENV === 'production') {
                res.redirect('/offline/workspaces/global');
            } else if (process.env.ENV === 'staging') {
                res.redirect('/offline/workspaces/global');
            }
        } else {
            res.redirect('/offline/workspaces/global');
        }
    });

    //online:
    server.get('/:type', (req, res) => {
        const params = { ...req.headers, ...req.params, filters: req.query };
        app.render(req, res, `/${req.params.type}`, params);
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

    server.listen(http_port, err => {
        if (err) throw err;
        console.log(`> HTTP listening in port ${http_port}`);
    });
});
