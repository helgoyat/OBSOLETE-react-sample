const express = require('express');
const router = express.Router();
const User = require('../models/user');
// TEST
const USER = require('../TEST');

// ********************************************
// GET METHODS
// ********************************************

function myProfile(doc, ret, options) {
    const hide = '_id';
    if (hide) {
        hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    };
    return ret;
};

router.get('/account/profile', (req, res) => {
    User.findById(USER.id, 'firstname lastname country birthday bio completed').then((user) => {
        const data = user.toObject({ getters: false, transform: myProfile });
        res.json(data);
    }).catch(err => console.log(err));
});

router.get('/account/picture', (req, res) => {
    User.findById(USER.id, 'picture').then((user) => {
        const data = user.toObject({ virtuals: false, minimize: false, transform: null });
        res.json(data.picture);
    }).catch(err => console.log(err));
});

// ********************************************
// POST METHODS
// ********************************************

// ********************************************
// UPDATE METHODS
// ********************************************

router.post('/account/update-profile', (req, res) => {
    const data = req.body;
    const options = { runValidators: true };
    User.updateOne({ _id: USER.id }, {
        $set: {
            firstname: data.firstname,
            lastname: data.lastname,
            country: data.country,
            birthday: data.birthday,
            bio: data.bio,
            completed: true
        }
    }, options).then(() => {
        res.status(200).end();
    }).catch(err => {
        console.log(err);
        res.status(400).end();
    });
});

router.post('/account/update-picture', (req, res) => {
    const { type, url } = req.body;
    const binData = Buffer.from(url.split(',')[1], 'base64');
    const picture = {
        data: binData,
        contentType: type
    };
    const options = { runValidators: true };
    User.updateOne({ _id: USER.id }, { $set: { picture: picture } }, options)
        .then(() => {
            res.status(200).end();
        }).catch(err => {
            console.log(err);
            res.status(400).end();
        });
});

// ********************************************
// DELETE METHODS
// ********************************************









// ********************************************
// TEST
// ********************************************
router.get('/create-test', (req, res) => {
    const user = new User({
        auth0: '111111',
        firstname: '',
        lastname: '',
        country: '',
        birthday: '1985-04-05T13:45:59.000Z',
        bio: ''
    });
    user.save().then((user) => {
        const setting = new Setting({
            user: user._id,
            currency: 'USD'
        });
        setting.save().then(() => {
            res.json({ msg: 'Done!' });
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
});

module.exports = router;