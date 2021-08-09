const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');

const userCtrl = require('../controllers/user');

router.use(express.json());

router.get('/test', userCtrl.test);

router.get('/users', userCtrl.getUsers);

router.get('/users/shipping_address', cors.corsWithOptions, authenticate.verifyUser, userCtrl.getShippingAddress);

router.get('/checkJWTtoken', userCtrl.checkJWTtoken);

//router.get('/auth/google/token', userCtrl.googleLogin);

router.post('/signup', cors.corsWithOptions, userCtrl.signup);

router.post('/users/shipping_address', cors.corsWithOptions, authenticate.verifyUser, userCtrl.postShippingAddress);

router.put('/users/shipping_address', cors.corsWithOptions, authenticate.verifyUser, userCtrl.updateShippingAddress);

router.put('/users/shipping_address', cors.corsWithOptions, authenticate.verifyUser, userCtrl.deleteShippingAddress);
//router.post('/store', cors.corsWithOptions, userCtrl.store);

//router.post('/store/storeId', cors.corsWithOptions, userCtrl.storeId);

//router.post('/loginsocial', userCtrl.loginGoogleUser);

router.post('/logincustom', cors.corsWithOptions, userCtrl.loginCustomUser);

module.exports = router;