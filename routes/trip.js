const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const Alliance = require('../models/alliance');
const Store = require('../models/store');
// TEST
const USER = require('../TEST');

// ********************************************
// GET METHODS
// ********************************************

function myAvailableTrips(doc, ret, options) {
    const hide = 'id';
    if (hide) {
        hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    };
    return ret;
};

// Trips page
router.post('/available', (req, res) => {
    const offset = parseInt(req.query.offset);
    const filter = req.body;
    console.log(filter);
    Trip.find({
        offerFrozen: false,
        status: 0,
        user: { $ne: USER.id },
        fromCountry: filter.fromCountry,
        toAirport: filter.toAirport,
        stores: { $in: [...filter.stores] },
        $or: [
            { dropAirport: filter.dropAirport },
            { dropCities: filter.dropCities, cities: { $in: [...filter.cities] } }
        ],
        packageSize: { $in: [...filter.packageSize] },
    }).populate('user stores')
        .skip(offset)
        .limit(4)
        .sort({ arrivalDate: 1 })
        .then((trips) => {
            const data = trips.map(e => ({ trip: e.toObject(), user: e.user.toObject() }));
            res.set('cache-control', 'no-store');
            res.json(data);
        }).catch(err => console.log(err));
});

router.post('/count-available', (req, res) => {
    const filter = req.body;
    Trip.find({
        offerFrozen: false,
        status: 0,
        user: { $ne: USER.id },
        fromCountry: filter.fromCountry,
        toAirport: filter.toAirport,
        stores: { $in: [...filter.stores] },
        $or: [
            { dropAirport: filter.dropAirport },
            { dropCities: filter.dropCities },
        ],
        packageSize: { $in: [...filter.packageSize] },
        cities: { $in: [...filter.cities] }
    }).countDocuments()
        .then((count) => {
            res.set('cache-control', 'no-store');
            res.json(count)
        }).catch(err => console.log(err));
});

// For making offers to orders (dropdown suggestions)
router.get('/account/available-condensed', (req, res) => {
    Trip.find({ user: USER.id, requestFrozen: false, status: 0 }, "arrivalDate fromAirport toAirport")
        .sort({ arrivalDate: 1 })
        .then((trips) => {
            const data = trips.map(e => (e.toObject({ transform: myAvailableTrips })));
            res.json(data);
        }).catch(err => console.log(err));
});

// MyTrips page
router.get('/account/count-available', (req, res) => {
    Trip.find({ user: USER.id, status: 0 })
        .countDocuments()
        .then((count) => res.json(count))
        .catch(err => console.log(err));
});

router.get('/account/available', (req, res) => {
    const offset = parseInt(req.query.offset);
    Trip.find({ user: USER.id, status: 0 }).populate('user stores')
        .skip(offset)
        .limit(4)
        .sort({ arrivalDate: 1 })
        .then(async (trips) => {
            const data = await Promise.all(trips.map(async e => {
                try {
                    const trip = e.toObject();
                    const countOffers = await Alliance.find({ trip: e._id, receiver: USER.id }).countDocuments();
                    const countRequests = await Alliance.find({ trip: e._id, initiator: USER.id }).countDocuments();
                    trip.countOffers = countOffers;
                    trip.countRequests = countRequests;
                    return { trip: trip, user: e.user.toObject() };
                } catch (err) {
                    console.log(err);
                    res.status(400).end();
                };
            }));
            res.json(data);
        }).catch(err => console.log(err));
});

router.get('/account/count-current', (req, res) => {
    Trip.find({ user: USER.id, status: { $in: [1, 2, 3, 4] } })
        .countDocuments()
        .then((count) => res.json(count))
        .catch(err => console.log(err));
});

router.get('/account/current', (req, res) => {
    const offset = parseInt(req.query.offset);
    Trip.find({ user: USER.id, status: { $in: [1, 2, 3, 4] } }).populate('user stores')
        .skip(offset)
        .limit(4)
        .sort({ arrivalDate: 1 })
        .then((trips) => {
            const data = trips.map(e => ({ trip: e.toObject(), user: e.user.toObject() }));
            res.json(data);
        }).catch(err => console.log(err));
});

router.get('/account/count-completed', (req, res) => {
    Trip.find({ user: USER.id, status: 5 })
        .countDocuments()
        .then((count) => res.json(count))
        .catch(err => console.log(err));
});

router.get('/account/completed', (req, res) => {
    const offset = parseInt(req.query.offset);
    Trip.find({ user: USER.id, status: 5 }).populate('user stores')
        .skip(offset)
        .limit(4)
        .sort({ arrivalDate: 1 })
        .then((trips) => {
            const data = trips.map(e => ({ trip: e.toObject(), user: e.user.toObject() }));
            res.json(data);
        }).catch(err => console.log(err));
});


// ********************************************
// POST METHODS
// ********************************************

router.post('/create', async (req, res) => {
    const data = req.body;
    const trip = new Trip({
        user: USER.id,
        fromCountry: data.fromCountry,
        fromAirport: data.fromAirport,
        toCountry: data.toCountry,
        toAirport: data.toAirport,
        arrivalDate: data.arrivalDate,
        packageSize: data.packageSize,
        dropAirport: data.dropAirport,
        dropCities: data.dropCities,
        arrivalRange: data.arrivalRange,
        cities: data.cities,
        stores: [...new Set(data.stores)],
        comment: data.comment
    });
    trip.save().then(() => {
        res.status(200).end();
    }).catch(err => {
        console.log(err);
        res.status(400).end();
    });
});

// ********************************************
// UPDATE METHODS
// ********************************************

// ********************************************
// DELETE METHODS
// ********************************************

router.post('/delete', (req, res) => {
    const { trip } = req.body;
    Trip.findByIdAndDelete(trip).then(() => {
        Alliance.deleteMany({ trip: trip }).then(() => {
            res.status(200).end();
        }).catch(err => {
            console.log(err);
            res.status(400).end();
        });
    }).catch(err => {
        console.log(err);
        res.status(400).end();
    });
});

module.exports = router;