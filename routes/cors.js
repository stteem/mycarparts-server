const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
    'http://localhost:4200',
    /\.localhost\.4200$/, 
    'https://angry-hamilton-37fe82.netlify.app', 
    /\.angry-hamilton-37fe82.netlify\.app$/
];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);