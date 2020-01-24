const Product = require('../models/product')

const mongoose = require('mongoose');

// Database connection
mongoose.connect(
    'mongodb+srv://neymarjimoh:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-xjpod.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true ,
      useUnifiedTopology: true
    }
)
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Local database connection
// var mongoDB = 'mongodb://127.0.0.1/shoes-cart';
// mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
// var db = mongoose.connection;
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const products = 
    [
        new Product({
        imagePath: '/images/classic osford shoe.jpg',
        name: 'Classic Osford shoe',
        price: 55
        }),

        new Product({
            imagePath: '/images/downlo1ad.jpg',
            name: 'Air Max 55 bug',
            price: 70
        }),

        new Product({
            imagePath: '/images/downloa55d.jpg',
            name: 'Modern Church rat Shoe',
            price: 25
        }),

        new Product({
            imagePath: '/images/download (1).jpg',
            name: 'Classic Brigade Soppa',
            price: 40
        }),

        new Product({
            imagePath: '/images/download (3).jpg',
            name: 'Black Cover Shoe',
            price: 55
        }),

        new Product({
            imagePath: '/images/1 (3).jpg',
            name: 'Versace Rocking Shoe',
            price: 30
        })

    ]
var done = 0
for (var i = 0; i < products.length; i++) {
    products[i].save((err, result) => {
        done++
        if (done === products.length){
            exit()
        }
    })
}
 function exit() {
     mongoose.disconnect()
}
