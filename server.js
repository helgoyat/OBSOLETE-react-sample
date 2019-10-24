const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const uuidv1 = require('uuid/v1');
const dotenv = require('dotenv');
dotenv.config();

// INIT APP
const App = express();
// PASSPORT CONFIG
require('./config/passport')(passport);

// MIDDLEWARES
App.use(helmet());
App.use(express.json({ limit: '0.5mb' }));
App.use(express.urlencoded({ limit: '0.5mb', extended: false }));
// App.use(express.json());
// App.use(express.urlencoded({ extended: false }));
App.use(cors());

// EXPRESS SESSION
const sess = {
    genid: function (req) {
        return uuidv1();
    },
    name: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    cookie: {
        // maxAge: 25 * 1000
        maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
};

App.use(session(sess));

// INITIALIZE PASSPORT
App.use(passport.initialize());
App.use(passport.session());

// CONNECT TO MONGODB
mongoose
    .connect(process.env.MONGODB, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// ROUTES
App.use('/auth', require('./routes/auth'));
App.use('/user', require('./routes/user'));
App.use('/setting', require('./routes/setting'));
App.use('/trip', require('./routes/trip'));
App.use('/order', require('./routes/order'));
App.use('/alliance', require('./routes/alliance'));
App.use('/utils', require('./routes/utils'));
App.use('/store', require('./routes/store'));
App.use('/product', require('./routes/product'));

// SET PORT
const port = '5000';

// START SERVER ON PORT
App.listen(port, () => console.log(`Server started on port ${port}`));