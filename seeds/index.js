const mongoose = require('mongoose');

const Campground = require('../models/campground');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/campsight', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection Error:'));
db.once("open", function(){
    console.log('Databse Connected!')
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        let r = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 45) + 10;
        const camp = new Campground({
            author: '62bd63818a5a0ccf63ab5a61',
            title:  `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[r].city}, ${cities[r].state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dqbt0uz6n/image/upload/v1656855992/CampSight/bnjqs5eymresbege5zwn.jpg',
                  filename: 'CampSight/bnjqs5eymresbege5zwn',
                },
                {
                  url: 'https://res.cloudinary.com/dqbt0uz6n/image/upload/v1656855993/CampSight/oln1ntrpizmkzbhfctxg.jpg',
                  filename: 'CampSight/oln1ntrpizmkzbhfctxg',
                }
            ],
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequatur repellendus eaque est? Soluta voluptates fugiat eveniet recusandae provident, alias deserunt iusto neque fugit quaerat obcaecati rem repudiandae laudantium quam?`,
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})