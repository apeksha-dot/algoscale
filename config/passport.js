const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model MongoDB
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'userId' }, (userId, password, done) => {
            // Match user exists
            User.findOne({
                userId: userId
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'This email is not registered' });
                }

                // Match the password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'The password is incorrect' });
                    }
                });
            });
        })
    );
    

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};