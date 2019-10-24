const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Packages
const Moment = require('moment');
// Utils
const FunctionsGetters = require('../utils/functionsGetters');
const FunctionsSetters = require('../utils/functionsSetters');
const FunctionsValidators = require('../utils/functionsValidators');

const tripSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    fromCountry: {
        type: String,
        validate: [FunctionsValidators.validateCountry, 'Invalid fromCountry'],
        required: true
    },
    fromAirport: {
        type: String,
        validate: {
            validator: function (val) {
                return FunctionsValidators.validateAirport(val, this.fromCountry);
            },
            message: 'Invalid fromAirport'
        },
        required: true
    },
    toCountry: {
        type: String,
        validate: [FunctionsValidators.validateCountry, 'Invalid toCountry'],
        required: true
    },
    toAirport: {
        type: String,
        validate: {
            validator: function (val) {
                return FunctionsValidators.validateAirport(val, this.toCountry);
            },
            message: 'Invalid toAirport'
        },
        required: true
    },
    arrivalDate: {
        type: Date,
        min: Moment().add(1, 'days'),
        max: Moment().add(1, 'years'),
        get: FunctionsGetters.getDateFormat,
        required: true
    },
    packageSize: {
        type: Number,
        min: 0,
        max: 2,
        get: FunctionsGetters.getPackageSize,
        validate: [FunctionsValidators.validateInteger, 'Invalid packageSize'],
        required: true
    },
    arrivalRange: {
        type: Number,
        min: 0,
        max: 7,
        set: function (val) {
            return FunctionsSetters.setArrivalRange(this.dropAirport, val);
        },
        get: FunctionsGetters.getArrivalRange,
        validate: {
            validator: function (val) {
                if (this.dropAirport) {
                    return FunctionsValidators.validateInteger(val);
                } else {
                    return true;
                }
            },
            message: 'Invalid arrivalRange'
        },
        required: function () {
            return this.dropAirport;
        }
    },
    dropAirport: {
        type: Boolean,
        validate: {
            validator: function (val) {
                return (!val && !this.dropCities) ? false : true;
            },
            message: 'DropAirport and DropCities cannot be both false'
        },
        required: true
    },
    dropCities: {
        type: Boolean,
        validate: {
            validator: function (val) {
                return (!val && !this.dropAirport) ? false : true;
            },
            message: 'DropAirport and DropCities cannot be both false'
        },
        required: true
    },
    cities: {
        type: Array,
        set: function (val) {
            return FunctionsSetters.setCities(this.dropCities, val);
        },
        validate: {
            validator: function (val) {
                if (this.dropCities) {
                    return FunctionsValidators.validateCities(val, this.toCountry);
                } else {
                    return true;
                }
            },
            message: 'Invalid cities'
        },
        required: function () {
            return this.dropCities;
        }
    },
    stores: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'store',
            required: true
        }],
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 200,
        get: FunctionsGetters.getComment,
        required: false
    },
    offerFrozen: {
        type: Boolean,
        default: false,
        required: true
    },
    requestFrozen: {
        type: Boolean,
        default: false,
        required: true
    },
    status: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        validate: [FunctionsValidators.validateInteger, 'Invalid status'],
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        get: FunctionsGetters.getDateFormat,
        required: true
    },
});

if (!tripSchema.options.toObject) tripSchema.options.toObject = {};
tripSchema.options.toObject.getters = true;
tripSchema.options.toObject.versionKey = false;
tripSchema.options.toObject.hide = 'id user';
tripSchema.options.toObject.transform = function (doc, ret, options) {
    if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
    ret.fromCountry = FunctionsGetters.getCountry(doc.fromCountry);
    ret.fromAirport = `${FunctionsGetters.getAirport(doc.fromCountry, doc.fromAirport)} (${doc.fromAirport})`;
    ret.toCountry = FunctionsGetters.getCountry(doc.toCountry);
    ret.toAirport = `${FunctionsGetters.getAirport(doc.toCountry, doc.toAirport)} (${doc.toAirport})`;
    ret.stores = doc.stores.map(e => (e.name));
    ret.cities = doc.cities.map(e => (`${e.value} (${e.state})`));
    return ret;
};

const Trip = mongoose.model('trip', tripSchema);

module.exports = Trip;