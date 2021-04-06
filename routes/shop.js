const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const multerUpload = require('../middlewares/multer');
const Shop = require('../models/shop');



const shopRouter = express.Router();

shopRouter.use(express.json());

shopRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    console.log('found this', req.user);
    Shop.find({owner : req.user._id})
    //.populate('owner')
    .then((shop) => {
        console.log('found', shop)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('user ' + req.user);
    req.body.owner = req.user._id;
    console.log('got here', req.body);
    Shop.create(req.body)
    .then((shop) => {
        console.log('Shop Created ', shop);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    })
    .catch((err) => {
        console.log('error ', err)
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
    });
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

shopRouter.route('/:storeId/items')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Shop.findById(req.params.storeId)
    .populate('items.vendor')
    .then((store) => {
        if (store != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(store.items);
        }
        else {
            err = new Error('store ' + req.params.storeId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, multerUpload, (req, res, next) => {
    Shop.findById(req.params.storeId)
    .then((store) => {
        if (store != null) {
            req.body.owner = req.user._id;
            req.body.imageurl = req.file.path;
            req.body.imageid = req.file.filename;
            store.items.unshift(req.body);
            store.save()
            .then((item) => {
                const result = item.items[0];
                console.log('result ', result)

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);          
            }, (err) => {
                    console.log('error ', err)
                    //res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.status(500).json(err);
            })
            .catch(err => {throw(err)})
        }
        else {
            err = new Error('Store ' + req.params.storeId + ' not found');
            err.status = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json(err);
        }
    })
    .catch((err) => {
        console.log('error ', err)
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /storees/'
        + req.params.storeId + '/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Shop.findById(req.params.storeId)
    .then((store) => {
        if (store != null) {
            for (var i = (store.comments.length -1); i >= 0; i--) {
                store.comments.id(store.comments[i]._id).remove();
            }
            store.save()
            .then((store) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(store);                
            }, (err) => next(err));
        }
        else {
            err = new Error('store ' + req.params.storeId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = shopRouter;