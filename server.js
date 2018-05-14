const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 9500;

app.prepare().then(() => {
    const server = express();

    // Redirects primary url to runs/all
    server.get('/', (req, res) => {
        res.redirect('/online/runs/all');
    });

    server.get('/:type/:section/:run_filter', (req, res) => {
        const actual_page = '/online';
        app.render(req, res, actual_page, req.params);
    });

    server.get('/:type/:section', (req, res) => {
        const actual_page = '/online';
        app.render(req, res, actual_page, req.params);
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
