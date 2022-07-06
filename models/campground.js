const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reviews = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// ! Mongoose Middleware
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if(campground.reviews.length) {
        const res = await Reviews.deleteMany({_id: { $in: campground.reviews }});
        console.log(res);
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;