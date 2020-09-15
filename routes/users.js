const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const passport = require('passport');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Post request on registration form
router.post('/register', (req,res) => {
    const { userId, password, password2} = req.body;

    let errors = [];

    if( !userId || !password || !password2 ){
        errors.push({ message: "Please fill all fields"})
    }

    if(password !== password2){
        errors.push({ message: "Password don't match"})
    }

    if(errors.length > 0){
        res.render('register', {errors, userId, password, password2});
    }else{
        //find user doesn't exsist
        User.findOne({userId: userId})
        .then(user => {
            errors.push({message: "User already exists"});
            if(user){
                res.render('register', { errors, userId, password, password2 });
            }//If user is new
            else{
                const newUser = new User ({
                    userId,
                    password,
                    password2
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        })
    }
})


// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
});

//Logout
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/users/login');
})

//delete 
// router.delete('/dashboard', (req, res) => {
  
// })

module.exports = router;