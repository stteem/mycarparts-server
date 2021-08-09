//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');


exports.signup = (req, res, next) => {

  const newUser = {
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    telnum : req.body.telnum,
    username: req.body.email
}
  User.register(new User(newUser), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
   
    console.log('user ',response);
    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        firstname: response.firstname,
        lastname: response.lastname,
        message: 'Sign up successful'
      });
    });  
  });
};


exports.loginCustomUser = (req, res, next) => {
  console.log('this req', req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err){
      console.log('this err', err);
      return next(err);
    } 

    if (!user) {
      console.log('this info', info);
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: false, status: 'Login Unsuccessful, Password or email is incorrect!', err: info});
      
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 402;
        res.setHeader('Content-Type', 'application/json');
        return res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'}); 
                
      }
      // user has been loaded into the request by passport.authenticate
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        token: token,
        firstname: user.firstname
      });
    }); 
  }) (req, res, next);
};

exports.googleLogin = (req, res) => {
  passport.authenticate('google'), (req, res) => {
    console.log('req.user1', req.user);
    if (req.user) {
      console.log('req.user', req.user);
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    }
  }
}


const decodeToken = (token) => {
  const decoded = jwt.decode(token, {complete: true});
  return decoded;
}


// Google sign in and sign up
exports.loginGoogleUser = (req, res, next) => {
  console.log('req google body ', req.body);
  User.findOne({ email: req.body.email }).then(
    (user) => {
      console.log('lets try google')
      if (!user) {

        console.log("not user, let's save user")
        // No user was found, let's create a new user
        // but first let's verify that this is a google user
        let decoded = decodeToken(req.body.token);

        if (decoded.payload.iss == 'accounts.google.com') {
          const name = req.body.name.split(' ');
          console.log('name ',name)
          const signUpGoogleUser = new User({
            firstname: name[0],
            lastname: name[1],
            email: req.body.email,
            imageUrl: req.body.image
          });
          return signUpGoogleUser.save().then(
            (response) => {
              
              const token = jwt.sign({ userId: response._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });

                res.status(201).json({
                  token: token,
                  user: response.firstname,
                  email: response.email,
                  image: response.imageUrl,
                  message: 'User added successfully!'
              });
            }
          ).catch(
            (error) => {
              res.status(500).json({
                error: error
              });
            }
          );
        }
      }

      // If we found the user, let's verify that it's a google account
      // and also compare the token email with the user email
      console.log('Oops! we already have that user, have him')

      let decoded = decodeToken(req.body.token);

      if (decoded.payload.iss == 'accounts.google.com' && decoded.payload.email == user.email) {

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
          token: token,
          user: user.firstname,
          email: user.email,
          image: user.imageUrl,
          message: 'User found!'
        });
      }
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}



exports.getUsers = (req, res, next) => {
  User.find().then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.test = (req, res) => {
  return res.status(200).json({
   message: "pass!" 
  });
};



exports.checkJWTtoken = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) {
      console.log('error ', err);
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      console.log('info ', info);
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user.firstname});
    }
  }) (req, res, next);
};


exports.getShippingAddress = (req, res, next) => {
  console.log('shipping requested')
    User.find({_id: req.user._id },{shipping_address:1})
    .then((address) => {
        console.log('found', address)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(address);
    }, (err) => next(err))
    .catch((err) => {
      console.log('error ', err)
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
    });
}

exports.postShippingAddress = (req, res, next) => {
  console.log('body ',req.body)
  User.findById(req.user._id)
    .then((user) => {
      user.shipping_address.push(req.body);
      user.save()
      .then((user) => {
        User.find({_id: req.user._id },{shipping_address:1})
        .then((address) => {

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(address);               
        }, (err) => next(err));
      }, (err) => next(err))              
    }, (err) => next(err))
    .catch((err) => {
      console.log('error ', err)
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
    });
}

exports.updateShippingAddress = (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: req.body
    }, { new: true })
    .then((address) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(address);
    }, (err) => next(err))
    .catch((err) => {
      console.log('error ', err)
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
    });
}

exports.deleteShippingAddress = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    $pull: {shipping_address: {_id: req.body._id}}
  })
  .then(() => {
    res.setHeader('Content-Type', 'application/json'); 
    res.statusCode = 201;
    res.json({message: 'success'});
  })
}