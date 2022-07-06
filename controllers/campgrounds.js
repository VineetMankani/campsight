const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const {cloudinary} = require('../cloudinary');

module.exports.index = wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

module.exports.renderNewForm = (req, res) => {             // Render page for creating new campground
    res.render('campgrounds/new');
}

module.exports.createCampground = wrapAsync(async (req, res, next) => {           // Post form data for creating new campground
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground created successfully')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.showCampground = wrapAsync(async (req, res) => {
    const {id} = req.params;
    // const campground = await Campground.findById(id).populate('reviews').populate('author');
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground Not Found!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
})



module.exports.renderEditForm = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground Not Found!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
})

module.exports.editCampground = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true, new: true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Campground updated successfully')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteCampground = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully')
    res.redirect('/campgrounds')
})