'use strict';

const DATA_HANDLER = require('./node/DataHandler');
const FORMIDABLE = require('formidable');

/**
 * Web server utilizing HTTP/2
 */
class app {
    #data_handler;
    #ejsData;
    #fileName;

    /**
     * @desc instantiates DataHandler object
     */
    constructor() {
        this.#data_handler = new DATA_HANDLER();
        this.#ejsData = null;
        this.#fileName = `index.ejs`;
        this.loadServer();
    }

    /**
     * Route & mime type handler
     */
    loadServer() {
        const HTTP = require('http');
        const HTTP2 = require('http2');
        const EJS = require('ejs');
        const PORT = process.env.PORT || 443;
        const SSL_OPTIONS = {
            key: DATA_HANDLER.getKey(),
            cert: DATA_HANDLER.getCert(),
            requestCert: true,
            rejectUnauthorized: false
        };

        HTTP.createServer((request, response) => {
            response.writeHead(301, {
                'Location': `https://${request.headers['host']}${request.url}`
            });
            response.end();
        }).listen(80);

        HTTP2.createSecureServer(SSL_OPTIONS, async (request, response) => {

            let httpHandler = (error, string, contentType) => {
                if (error) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end('An error has occurred: ' + error.message);
                } else if (contentType.indexOf('css') >= 0 || contentType.indexOf('js') >= 0) {
                    response.setHeader('Cache-Control', 'max-age=86400');
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(string, 'utf-8');
                } else if (contentType.indexOf('html') >= 0) {
                    response.setHeader('Cache-Control', 'max-age=86400');
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(EJS.render(string, {
                        data: this.#ejsData,
                        filename: this.#fileName
                    }));
                } else {
                    response.setHeader('Cache-Control', 'max-age=86400');
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(string, 'binary');
                }
            };

            if (request.method === 'POST') {
                if (request.headers['x-requested-with'] === 'fetch.0') {
                    let formData = {};
                    new FORMIDABLE.IncomingForm().parse(request).on('field', (field, name) => {
                        formData[field] = name;
                    }).on('error', (err) => {
                        next(err);
                    }).on('end', () => {
                        this.#data_handler.insertRow(formData);
                    });
                } else if (request.headers['x-requested-with'] === 'fetch.1') {
                    this.#data_handler.getAllAssets(function (fetchedData) {
                        response.setHeader('Cache-Control', 'max-age=86400');
                        response.writeHead(200, {'content-type': 'text/plain'});
                        response.end(JSON.stringify(fetchedData));
                    });
                } else if (request.headers['x-requested-with'] === 'fetch.2') {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString();
                        this.#data_handler.deleteAssets(body);
                    });
                } else if (request.headers['x-requested-with'] === 'fetch.3') {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('error', (err) => {
                        next(err);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString().toUpperCase();
                        this.#data_handler.queryData(body, function (fetchedData) {
                            response.setHeader('Cache-Control', 'max-age=86400');
                            response.writeHead(200, {'content-type': 'text/plain'});
                            response.end(JSON.stringify(fetchedData));
                        });
                    });
                } else if (request.headers['x-requested-with'] === 'fetch.4') {
                    DATA_HANDLER.getAssetData('info', (assetData) => {
                        assetData = JSON.stringify(assetData);
                        response.writeHead(200, {'content-type': 'application/json'});
                        response.end(assetData);
                    });
                }  else if (request.headers['x-requested-with'] === 'fetch.5') {
                    DATA_HANDLER.getAssetData('models', (assetData) => {
                        assetData = JSON.stringify(assetData);
                        response.writeHead(200, {'content-type': 'application/json'});
                        response.end(assetData);
                    });
                } else if (request.headers['x-requested-with'] === 'fetch.6') {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('error', (err) => {
                        next(err);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString();
                        this.#data_handler.queryTag(body, function (tagExists) {
                            response.setHeader('Cache-Control', 'max-age=86400');
                            response.writeHead(200, {'content-type': 'text/plain'});
                            response.end(JSON.stringify(tagExists));
                        });
                    });
                } else if (request.headers['x-requested-with'] === 'fetch.7') {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('error', (err) => {
                        next(err);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString();
                        this.#data_handler.queryEditTag(body, function (assetProperties) {
                            response.setHeader('Cache-Control', 'max-age=86400');
                            response.writeHead(200, {'content-type': 'text/plain'});
                            response.end(JSON.stringify(assetProperties));
                        });
                    });
                } else {
                    console.log(`Yo, somethings super wrong BDH!`);
                }
            } else if (request.url.indexOf('.css') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'text/css', httpHandler, 'utf-8');
            } else if (request.url.indexOf('.js') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'application/javascript', httpHandler, 'utf-8');
            } else if (request.url.indexOf('.png') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'image/png', httpHandler, 'binary');
            } else if (request.url.indexOf('.ico') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'image/x-icon', httpHandler, 'binary');
            } else if (request.url.indexOf('day_results.ejs') >= 0) {
                DATA_HANDLER.renderDom('public/views/day_results.ejs', 'text/html', httpHandler, 'utf-8');
            } else if (request.url.indexOf('night_results.ejs') >= 0) {
                DATA_HANDLER.renderDom('public/views/night_results.ejs', 'text/html', httpHandler, 'utf-8');
            } else if (request.url.indexOf('/') >= 0) {
                DATA_HANDLER.renderDom('public/views/index.ejs', 'text/html', httpHandler, 'utf-8');
            } else {
                DATA_HANDLER.renderDom(`HEY! What you're looking for: It's not here!`, 'text/html', httpHandler, 'utf-8');
            }
        }).listen(PORT) && console.log(`____\nServer started & listening on port: ${PORT}\n____\n`);
    }
}

module.exports = app;