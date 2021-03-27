//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');


exports.signup = (req, res, next) => {
  User.register(new User({username: req.body.email}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.email = req.body.email;
      user.telnum = req.body.telnum;
      user.save((err, response) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
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
    }
  });
};


exports.loginCustomUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'}); 
        return;         
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

/*exports.signup = (req, res, next) => {
  //console.log('req.body ', req.body);
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        telnum: req.body.telnum,
        password: hash
      });
      //console.log('user ', user);
      user.save().then(
        (response) => {
          console.log('saved');
          //console.log('response ', response);
        return res.status(201).json({
            firstname: response.firstname,
            lastname: response.lastname,
            message: 'Sign up successful!'
          });
        }
      ).catch(
        (error) => {
          console.log('error dey o');
          res.status(500).json({
            error: error
          });
        }
      );
    }
  );
};


exports.loginCustomUser = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      //console.log('user ', user);
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          console.log('valid ', valid);
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }

          const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });

          //const img = user.image ? user.image : ''; 

          return res.status(200).json({
            token: token,
            firstname: user.firstname
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
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}
*/

const decodeToken = (token) => {
  const decoded = jwt.decode(token, {complete: true});
  return decoded;
}


// Google sign in and sign up
exports.loginGoogleUser = (req, res, next) => {
  console.log('req body ', req.body);
  User.findOne({ email: req.body.email }).then(
    (user) => {
      console.log('lets try google')
      if (!user) {

        console.log("not user, let's save user")
        // No user was found, let's create a new user
        // but first let's verify that this is a google user
        let decoded = decodeToken(req.body.token);

        if (decoded.payload.iss == 'accounts.google.com') {
          const signUpGoogleUser = new User({
            name: req.body.name,
            email: req.body.email,
            imageUrl: req.body.image
          });
          return signUpGoogleUser.save().then(
            (response) => {
              
              const token = jwt.sign({ userId: response._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });

                res.status(201).json({
                  token: token,
                  user: response.name,
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
      console.log('user ', user);
      return res.json({status: 'JWT valid!', success: true, user: user.firstname});
    }
  }) (req, res, next);
};