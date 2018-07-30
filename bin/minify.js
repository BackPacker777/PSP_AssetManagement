'use strict';

let compressor = require('node-minify');

function main() {
    compress();
}

main();

function compress() {
    compressor.minify({
        compressor: 'uglifyjs',
        input: '/public/javascripts/main.js',
        output: 'main.min.js',
        callback: function(err, min) {}
    });
}