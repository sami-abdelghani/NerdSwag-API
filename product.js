let mongoose = require('mongoose');
let schema = mongoose.Schema;

/*A product schema to make sure each product has a title, price,
 and an image URl to retrieve the designated image of the product*/
let product = new schema({
    title: String,
    price: Number,
    imgUrl: String
});

module.exports = mongoose.model('Product', product);
