const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');


router.get('/test', userCtrl.test);
router.get('/users', userCtrl.getUsers);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.loginGoogleUser);

module.exports = router;