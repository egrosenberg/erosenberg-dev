import express from "express";

import hbs from './modules/handlebars.mjs';

// register helpers
hbs.registerHelpers();

const STATUS = {
    Ok: 200,
    Created: 201,
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500,
};

const HOSTS = [
    "celestus.info",
    "127.0.0.1",
    "192.168.1.39"
];

// create app
const app = express();
// set port
const PORT = 2019;

// enable server to be proxied
app.set('trust proxy', [
    'loopback',
    'linklocal',
    'uniquelocal',
    '192.168.1.55'
]);

// allow access to public files
app.use(express.static('public'));

// listen on port
app.listen(PORT, HOSTS, () => {
    console.log(`Server is running on Port ${PORT}`)
})

/**
 * Home page of site
 */
app.get(['/','index','index.htm','index.html'], async (req, res) => {
    const msg = await hbs.renderFromTemplate('templates/index.hbs', {});
    return res.send(msg);
});

/**
 * Catch not found pages
 */
app.all(/(.*)/, async (req, res) => {
    const html = await hbs.renderFromTemplate('templates/404.hbs');
    res.status(STATUS.NotFound).send(html);
});

/**
 * Error handler
 */
app.use((err, req, res) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});
