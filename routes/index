const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        userId: req.user.userId
    })
);

router.get('/new', (req, res) =>{
    User.find({}, function(err, data){
        if(err){
            res.send('invalid');
        }
        else{
            res.render('dropdown', {users: data})
        }
    })
})

router.post('/new', (req, res)=> {
    User.findByIdAndDelete(req.body.select, function(err){
        if(err){
            res.send('invalid');

        }
        else {
            res.redirect('/dashboard')
        }
        console.log(req.body.select);
    })
})

module.exports = router;
