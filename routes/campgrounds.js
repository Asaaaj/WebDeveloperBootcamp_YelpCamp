const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find();
        res.render('campgrounds/index', { campgrounds });
    })
);

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
            .populate({ path: 'reviews', populate: { path: 'author' } })
            .populate('author');
        console.log(campground);
        if (!campground) {
            req.flash('error', 'Cannot Find That Campgroud!');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    })
);

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', 'Succesfully Made a New Campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash('error', 'Cannot Find That Campgroud!');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    })
);

router.put(
    '/:id',
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
        req.flash('success', 'Successfully Updated Campgroud!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    '/:id',
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully Deleted Campgroud!');
        res.redirect('/campgrounds');
    })
);

module.exports = router;
