const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Shop = require('../models/shop');

const shopRouter = express.Router();

shopRouter.use(express.json());

shopRouter.route('/shop')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    console.log('found this');
    Shop.find(req.query)
    .populate('owner')
    .then((shop) => {
        console.log('found')
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('user ' + req.user);
    
    console.log('got here');
    Shop.create(req.body)
    .then((shop) => {
        console.log('Shop Created ', shop);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end('PUT operation not supported on /Shop');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Shop.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = shopRouter;