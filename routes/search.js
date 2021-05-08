const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const url = require('url');
const Shop = require('../models/shop');



const searchRouter = express.Router();

searchRouter.use(express.json());

searchRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {

    const queryObject = url.parse(req.url,true).query;

    const { vehicletype, model, year, part, state, city } = queryObject; 
    
    //Shop.find({}, { vehicletype: vehicletype, model: model, year: year, part: part  } )
    Shop.where({}, { vehicletype: vehicletype, model: model, year: year, part: part  })
    .where({state: state, lga: city })
     .exec(function (err, results) {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json(err);
        }

        console.log('results ',results)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    });
});

module.exports = searchRouter;