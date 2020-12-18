var expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const routes = require('../controllers/user');




describe('User route', function() {
    beforeEach(function() {
        sinon.stub(User, 'findOne');
    });
 
 
    afterEach(function() {
        User.findOne.restore();
    });
 
    it('should send one user', () => {
        var expectedModel = { 	
			name: 'Uwem Uke',
			firstName: 'Uwem',
			email: 'sly@gmail.com',
			imageUrl: 'https://www.photos.com/a_photo'
        };
        var user = [expectedModel];
        User.findOne.yields(null, user);
        var req = { body: { } };
        var res = {
            json: sinon.stub()
        };
        var next;
 
        routes.loginGoogleUser(req, res, next);
 
        sinon.assert.calledWith(res.json, expectedModel);
    });
});



