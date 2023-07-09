const express = require('express');
const router = express.Router();

const trek = require('../controllers/trek');
const {validateCampground, isLoggedIn, isAuthor} = require('../middleware')

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(trek.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, trek.createCampground)

router.get('/new', isLoggedIn, trek.renderNewForm)

router.route('/:id')
    .get(trek.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, trek.editCampground)
    .delete(isLoggedIn, isAuthor, trek.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, trek.renderEditForm)

// router.delete('/trek/:id', isLoggedIn, wrapAsync(async (req, res) => {
//     const {id} = req.params;
//     const campground = await Campground.findByIdAndDelete(id);
//     res.redirect('/trek');
// }))
// Middleware set in model campground.js to delete all the reviews, etc associated with the campground

module.exports = router;