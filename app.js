const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


const app = express();

require('./config/passport')(passport);

const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

// Express session
app.use(
    session({
        secret: 'secretcode',
        resave: true,
        saveUninitialized: true
    })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Routes

app.use("/", require('./routes/index'));
app.use("/users", require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT , console.log(`Server started on ${PORT}`));