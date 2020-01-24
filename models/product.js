const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productShema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    imagePath: {type: String, required: true},
    name:{ type: String, required: true},
    price: { type: Number, required: true},
    quantity: {type: Number}
})

module.exports = mongoose.model('Product', productShema)