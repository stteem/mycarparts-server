const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');

const userCtrl = require('../controllers/user');

router.use(express.json());

router.get('/test', userCtrl.test);

router.get('/users', userCtrl.getUsers);

router.get('/checkJWTtoken', userCtrl.checkJWTtoken);

router.get('/auth/google/token', userCtrl.googleLogin);

router.post('/signup', cors.corsWithOptions, userCtrl.signup);

//router.post('/loginsocial', cors.corsWithOptions, userCtrl.loginGoogleUser);

router.post('/logincustom', cors.corsWithOptions, userCtrl.loginCustomUser);

module.exports = router;