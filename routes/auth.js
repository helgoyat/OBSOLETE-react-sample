const express = require('express');
const router = express.Router();
// const passport = require('passport');
// const util = require('util');
// const querystring = require('querystring');

// router.get('/login', passport.authenticate('auth0', {
//     scope: ['openid']
// }));

// router.get('/redirect', (req, res, next) => {
//     passport.authenticate('auth0',
//         (err, user, info) => {
//             res.locals.loginError = true;
//             if (err) {
//                 next(err);
//             } else if (!user) {
//                 if (info === "access_denied") res.locals.query = "We need access to your tenant information.";
//                 if (info === "unauthorized") res.locals.query = "Please verify your email address before logging in.";
//                 const err = new Error();
//                 next(err);
//             } else {
//                 req.logIn(user, (err) => {
//                     if (err) {
//                         next(err);
//                     } else {
//                         req.session.accessToken = info.accessToken;
//                         res.redirect('http://localhost:3000/');
//                     }
//                 });
//             }
//         })(req, res, next);
// });

// router.get('/logout', (req, res, next) => {
//     if (!req.user) {
//         const logoutURL = new URL(
//             util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
//         );
//         const searchString = querystring.stringify({
//             client_id: process.env.AUTH0_CLIENT_ID,
//             returnTo: process.env.AUTH0_RETURN_TO
//         });
//         logoutURL.search = searchString;
//         res.redirect(logoutURL);
//     } else {
//         req.session.destroy((err) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 req.logOut();
//                 res.clearCookie(process.env.COOKIE_NAME);
//                 const logoutURL = new URL(
//                     util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
//                 );
//                 const searchString = querystring.stringify({
//                     client_id: process.env.AUTH0_CLIENT_ID,
//                     returnTo: process.env.AUTH0_RETURN_TO
//                 });
//                 logoutURL.search = searchString;
//                 res.redirect(logoutURL);
//             }
//         });
//     }
// });

// router.get('/isAuth', (req, res) => {
//     if (!req.user) {
//         res.json({ isAuth: false });
//     } else {
//         res.json({ isAuth: true });
//     }
// });

module.exports = router;