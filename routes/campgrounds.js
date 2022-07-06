const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const {validateCampground, isLoggedIn, isAuthor} = require('../middleware')

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.createCampground)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, campgrounds.editCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)

// router.delete('/campgrounds/:id', isLoggedIn, wrapAsync(async (req, res) => {
//     const {id} = req.params;
//     const campground = await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))
// Middleware set in model campground.js to delete all the reviews, etc associated with the campground

module.exports = router;