const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
//const multer = require('../middleware/multer-config');


const itemsCtrl = require('../controllers/items');


//If  multer  is registered before authentication middleware, the file will be saved before the server
// gets a chance to check the user's authentication.  In these situations, always register  multer 
// after any authentication middleware.

router.get('/', itemsCtrl.getAllItems);

module.exports = router;