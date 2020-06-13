let mongoose = require('mongoose');
let schema = mongoose.Schema;

let product = new schema({
    title: String,
    price: Number,
    likes: {type: Number, default: 0},
    imgUrl: String
});

module.exports = mongoose.model('Product', product);
