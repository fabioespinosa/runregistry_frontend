const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENVE !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = 9500;

app.prepare().then(() => {
    const server = express();

    server.get('/', (req, res) => {
        const actual_page = '/home';
        app.render(req, res, actual_page);
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
