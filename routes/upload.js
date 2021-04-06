const express = require('express');
const authenticate = require('../authenticate');
const multerUpload = require('../middlewares/multer');
const cors = require('./cors');


const Shop = require('../models/shop');

const uploadRouter = express.Router();

uploadRouter.post('/', authenticate.verifyUser, multerUpload, (req, res) => {
    console.log('req.file :', req.file);
    console.log('req.body.item :', req.body.item);
    console.log('req.user :', req.user);
    console.log('req.body.storeid :', req.body.storeid);

    /*const image = {};
    image.url = req.file.url;
    image.id = req.file.public_id;
    Shop.create(image) // save image information in database
    .then(newImage => res.json(newImage))
    .catch(err => console.log(err));*/
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(
             req.body
        );    
    
});



module.exports = uploadRouter;