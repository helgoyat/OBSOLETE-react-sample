const Auth0Strategy = require('passport-auth0');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

module.exports = function (passport) {

    const strategy = new Auth0Strategy(
        {
            domain: process.env.AUTH0_DOMAIN,
            clientID: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            callbackURL: process.env.AUTH0_CALLBACK_URL
        },
        function (accessToken, refreshToken, extraParams, profile, done) {
            // console.log(profile.id);
            // console.log(extraParams);

            // ERROR TESTING
            // const err = new Error('Error testing...');
            // return done(err, null);
            
            // PROCESS LOGIN
            const info = { accessToken: accessToken };
            User.findOne({ auth0: profile.id }).then((currentUser) => {
                if (currentUser) {
                    return done(null, currentUser.id, info);
                } else {
                    const newUser = new User({
                        auth0: profile.id,
                        completed: false
                    });
                    const imgPath = './default_picture.png';
                    const file = path.resolve(__dirname, imgPath);
                    newUser.picture.data = fs.readFileSync(file);
                    newUser.picture.contentType = 'image/png';
                    newUser.save().then(newUser => {
                        return done(null, newUser.id, info);
                    }).catch(err => {
                        return done(err, null);
                    });
                }
            }).catch(err => {
                return done(err, null);
            });
        }
    );

    passport.use(strategy);

    passport.serializeUser(function (id, done) {
        done(null, id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
        // User.findById(id).then((user) => {
        //     done(null, user.id);
        // }).catch(err => {
        //     console.log('here');
        //     return done(err, null);
        // });
    });
}