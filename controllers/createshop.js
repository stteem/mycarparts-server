exports.loginGoogleUser = (req, res, next) => {
  
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
            user: user.firstName,
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
  