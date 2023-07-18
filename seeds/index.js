const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '64b14f96efef9b1aca1a5895',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique earum facere quibusdam autem, tenetur accusantium vel odio repellendus. Aliquam alias rerum ad, quam esse qui error est cum unde maiores!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dcsgbs34t/image/upload/v1689600476/YelpCamp/gmkstrujncbfltzo28ty.jpg',
                    filename: 'YelpCamp/gmkstrujncbfltzo28ty',
                },
                {
                    url: 'https://res.cloudinary.com/dcsgbs34t/image/upload/v1689600480/YelpCamp/g4xogywm4fs6wm9blp2k.jpg',
                    filename: 'YelpCamp/g4xogywm4fs6wm9blp2k',
                },
                {
                    url: 'https://res.cloudinary.com/dcsgbs34t/image/upload/v1689600494/YelpCamp/hlcy7dyyquintcvh2kdo.jpg',
                    filename: 'YelpCamp/hlcy7dyyquintcvh2kdo',
                },
            ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    db.close();
});
