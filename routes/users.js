const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post(
    '/register',
    catchAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                } else {
                    req.flash('success', ` ${username}, Welcome to Yelp Camp!`);
                    res.redirect('/campgrounds');
                }
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('register');
        }
    })
);

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}!`);
    const redirectedUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectedUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});
module.exports = router;
