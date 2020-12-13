const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(
        () => {
          res.status(201).json({
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
  );
};



exports.login = (req, res, next) => {
  console.log('request body', req.body)

  // If request body has password, we know it's from our custom login, and not from google's
  if (req.body.password) {
    User.findOne({ email: req.body.email }).then(
      (user) => {
        if (!user) {
          return res.status(401).json({
            error: new Error('User not found!')
          });
        }
        bcrypt.compare(req.body.password, user.password).then(
          (valid) => {
            if (!valid) {
              return res.status(401).json({
                error: new Error('Incorrect password!')
              });
            }

            const token = jwt.sign({ userId: user.objectId }, process.env.SECRET, { expiresIn: '24h' });

            return res.status(200).json({
              token: token,
              user: res.name,
              email: res.email,
              imageUrl: req.body.imageUrl
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

  const decodeToken = (token) => {
    const decoded = jwt.decode(token, {complete: true});
    return decoded;
  }

  // Google sign in and sign up
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
            imageUrl: req.body.imageUrl
          });
          console.log('new g user ', signUpGoogleUser)
          return signUpGoogleUser.save().then(
            (response) => {
              console.log('signUpGoogleUser res ', response)
              console.log('user.objectId ', response._id)
              const token = jwt.sign({ userId: response._id }, process.env.SECRET, { expiresIn: '24h' });

              res.setHeader('Authorization', token);
              console.log('Header set')
                res.status(201).json({
                  token: token,
                  user: response.name,
                  email: response.email,
                  imageUrl: response.imageUrl,
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

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '24h' });

        res.setHeader('Authorization', token);
        return res.status(200).json({
          token: token,
          user: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
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