const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Packages
const Moment = require('moment');
// Utils
const FunctionsGetters = require('../utils/functionsGetters');
const FunctionsValidators = require('../utils/functionsValidators');

const userSchema = new Schema({
    auth0: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: 60,
        required: false
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 60,
        required: false
    },
    country: {
        type: String,
        get: FunctionsGetters.getWorldCountry,
        validate: [FunctionsValidators.validateWorldCountry, 'Invalid country'],
        required: false
    },
    birthday: {
        type: Date,
        min: Moment().subtract(100, 'years'),
        max: Moment().subtract(18, 'years'),
        required: false
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 200,
        get: FunctionsGetters.getBio,
        required: false
    },
    picture: {
        data: Buffer,
        contentType: String,
        required: false
    },
    orders: {
        type: Number,
        min: 0,
        default: 0,
        validate: [FunctionsValidators.validateInteger, 'Invalid orders count'],
        required: true
    },
    trips: {
        type: Number,
        min: 0,
        default: 0,
        validate: [FunctionsValidators.validateInteger, 'Invalid trips count'],
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        required: true
    },
});

userSchema.virtual('username').get(function () {
    const lastnameChar = this.lastname.charAt(0);
    return `${this.firstname} ${lastnameChar}.`;
});

userSchema.virtual('age').get(function () {
    return `${Moment(this.birthday).fromNow(true)} old`;
});

userSchema.virtual('memberSince').get(function () {
    return Moment(this.createdAt).format('LL');
});

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.getters = true;
userSchema.options.toObject.minimize = false;
userSchema.options.toObject.versionKey = false;
userSchema.options.toObject.hide = '_id id auth0 firstname lastname birthday completed createdAt';
userSchema.options.toObject.transform = function (doc, ret, options) {
    if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
    return ret;
};

const User = mongoose.model('user', userSchema);

module.exports = User;